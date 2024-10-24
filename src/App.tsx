import { useEffect, useState } from 'react';
import './App.css';
import { Api } from './Api';
import { timeout } from 'rxjs';
import { LineChart } from '@mui/x-charts';
import { NetworkHistory } from './models/network.models';

function App() {

  type data = {
    data: number[],
    label:string
  }

  const networkHistories = new Map<string, NetworkHistory>();
  const [chartArray, setChartArray] = useState<{x:data[], y:data[]}[]>([])

  useEffect(() => {
    const api = new Api();

    function convertToChartArray():{x:data[], y:data[]}[] {
      const chartMap:Map<string,{x:data[], y:data[]}> = new Map<string, {x:data[], y:data[]}>();

      networkHistories.forEach((networkHistory,name) => {
        const xAxis:Map<string,data> = new Map<string,data>();
        const series: Map<string,data> = new Map<string,data>();

        networkHistory.latestRSSI.forEach(latestRSSIList => {
          latestRSSIList.forEach(latestRSSI => {
              if(!series.has(latestRSSI.scannedModuleSSID)){
                series.set(latestRSSI.scannedModuleSSID, {
                  data: [latestRSSI.rssi],
                  label:latestRSSI.scannedModuleName
                }),
                xAxis.set(latestRSSI.scannedModuleSSID,{
                  data: [0], //latestRSSI.dateTime.getTime()
                  label:latestRSSI.scannedModuleName
                })
              } else {
                const ssidSeries = series.get(latestRSSI.scannedModuleSSID);
                if(ssidSeries){
                  xAxis.get(latestRSSI.scannedModuleSSID)?.data.push(ssidSeries.data.length);
                  ssidSeries.data.push(latestRSSI.rssi);
                }
              }
          })
        })

        const xAxisArray = Array.from(xAxis.values());
        const seriesArray = Array.from(series.values());
        chartMap.set(name,{x:xAxisArray, y:seriesArray})
      });

      return Array.from(chartMap.values());
    }

    function refreshData(){
      setTimeout(() => {
      api.getModuleSources().then(sources => {
        sources.forEach(source => {
          if (!networkHistories.has(source)) {
            networkHistories.set(source, {
              macAddress: source,
              latestRSSI: [],
              averageRSSI: []
            })
          }
          const networkHistory = networkHistories.get(source);
          if (networkHistory) {
            api.getLatestScansFrom(source, 10).then((latestScans) => {
              networkHistory.latestRSSI.push(latestScans);
            });
            api.getAverageScansFrom(source, 10).then((averageScans) => {
              networkHistory.averageRSSI.push(averageScans);
            });
            networkHistories.set(source, networkHistory);
          }
        });
        setChartArray(convertToChartArray());
      });
      refreshData();
    }, 5000);
  }
  refreshData();
  }, [])

  return (
    <div>
      {
        chartArray.map(chart => {


          return (
            <LineChart
              xAxis={chart.x}
              series={chart.y}
              width={1400}
              height={300}
              slotProps={{legend:{ hidden: true }}}
            />
          )
        })
      }
    </div>
  );
}

export default App;
