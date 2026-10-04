/* overlays-sectelev crew (9/30/26): grids, dimensions, the VII.5 height method and the A1.3 compliance tags over
   A3.0 and A3.1 (sections) and A4.0 to A4.3 (elevations). The render stays the hero; this layer is hairlines, a few
   burnt orange marks and one column of tiny type per sheet.
   Registration: every mark is a model point projected with window.SHARED.coords.views (A3.1 with the frames sectelev-a
   places its two cuts at). Grids, levels and tags come from SHARED; heights from the height crew's A1.4 (sheets/height.js,
   where SHARED.heights disagrees A1.4 wins); the 30 ft envelope profile is the one precomputed piece, built by
   sheets/tools/overlays-sectelev/build.py into the data block below. */
(function () {
  if (!window.LIVING_OVERLAYS) return;
  const OSE = /*OSE:DATA*/{"src":"sheets/tools/overlays-sectelev/build.py","env":{"A4.0":[[-43.5,6021.69],[-42.5,6021.66],[-41.5,6021.67],[-40.5,6021.7],[-39.5,6022.04],[-38.5,6022.37],[-37.5,6022.52],[-36.5,6023.68],[-35.5,6023.76],[-34.5,6023.85],[-33.5,6023.31],[-32.5,6023.23],[-31.5,6023.17],[-30.5,6023.12],[-29.5,6023.17],[-28.5,6023.24],[-27.5,6023.32],[-26.5,6023.41],[-25.5,6023.5],[-24.5,6023.58],[-23.5,6023.67],[-22.5,6023.75],[-21.5,6023.83],[-20.5,6023.91],[-19.5,6023.99],[-18.5,6024.06],[-17.5,6024.15],[-16.5,6024.22],[-15.5,6024.29],[-14.5,6024.37],[-13.5,6024.44],[-12.5,6024.51],[-11.5,6024.59],[-10.5,6024.66],[-9.5,6024.72],[-8.5,6024.76],[-7.5,6024.62],[-6.5,6024.63],[-5.5,6024.64],[-4.5,6024.69],[-3.5,6024.72],[-2.5,6024.78],[-1.5,6025.07],[-0.5,6025.34],[0.5,6025.63],[1.5,6026.55],[2.5,6026.62],[3.5,6026.69],[4.5,6026.75],[5.5,6026.82],[6.5,6026.88],[7.5,6026.94],[8.5,6027.01],[9.5,6027.07],[10.5,6026.47],[11.5,6026.37],[12.5,6026.27],[13.5,6026.18],[14.5,6026.22],[15.5,6026.27],[16.5,6026.32],[17.5,6026.37],[18.5,6026.43],[19.5,6026.71],[20.5,6027.0],[21.5,6027.29],[22.5,6028.3],[23.5,6028.37],[24.5,6028.41],[25.5,6028.47],[26.5,6028.52],[27.5,6028.59],[28.5,6028.63],[29.5,6028.7],[30.5,6028.74],[31.5,6028.8],[32.5,6028.85],[33.5,6028.91],[34.5,6028.94],[35.5,6029.02],[36.5,6029.05],[37.5,6029.11],[38.5,6028.91],[39.5,6028.89],[40.5,6028.9],[41.5,6028.9],[42.5,6028.95],[43.5,6029.02],[44.5,6029.08],[45.5,6029.14],[46.5,6029.2],[47.5,6029.26],[48.5,6029.32],[49.5,6029.38],[50.5,6029.44],[51.5,6029.5],[52.5,6029.56],[53.5,6029.62],[54.5,6029.68],[55.5,6029.73],[56.5,6029.79],[57.5,6029.85],[58.5,6029.91],[59.5,6029.97],[60.5,6030.02],[61.5,6030.08],[62.5,6030.14],[63.5,6030.2],[64.5,6030.27],[65.5,6030.33],[66.5,6030.44],[67.5,6030.49],[68.5,6030.55],[69.5,6030.6],[70.5,6030.65],[71.5,6030.7],[72.5,6030.75],[73.5,6030.8],[74.5,6030.85],[75.5,6030.91],[76.5,6030.96],[77.5,6031.0],[78.5,6031.02],[79.5,6031.05],[80.5,6031.09]],"A4.1":[[-81.5,6025.1],[-80.5,6025.06],[-79.5,6025.1],[-78.5,6025.02],[-77.5,6024.88],[-76.5,6024.77],[-75.5,6024.69],[-74.5,6024.54],[-73.5,6024.42],[-72.5,6024.3],[-71.5,6024.17],[-70.5,6024.03],[-69.5,6023.85],[-68.5,6023.69],[-67.5,6023.56],[-66.5,6023.34],[-65.5,6023.25],[-64.5,6023.32],[-63.5,6022.53],[-62.5,6022.25],[-61.5,6021.97],[-60.5,6021.7],[-59.5,6021.54],[-58.5,6021.44],[-57.5,6021.4],[-56.5,6021.43],[-55.5,6021.5],[-54.5,6021.67],[-53.5,6021.86],[-52.5,6022.05],[-51.5,6022.66],[-50.5,6022.68],[-49.5,6022.7],[-48.5,6022.73],[-47.5,6022.75],[-46.5,6022.77],[-45.5,6022.8],[-44.5,6022.83],[-43.5,6022.83],[-42.5,6022.86],[-41.5,6022.88],[-40.5,6022.9],[-39.5,6022.93],[-38.5,6022.97],[-37.5,6023.0],[-36.5,6023.0],[-35.5,6023.21],[-34.5,6023.42],[-33.5,6023.63],[-32.5,6024.41],[-31.5,6024.44],[-30.5,6024.48],[-29.5,6024.51],[-28.5,6024.55],[-27.5,6024.59],[-26.5,6024.62],[-25.5,6024.66],[-24.5,6024.7],[-23.5,6024.74],[-22.5,6024.77],[-21.5,6024.81],[-20.5,6025.61],[-19.5,6026.4],[-18.5,6027.19],[-17.5,6030.28],[-16.5,6030.28],[-15.5,6030.3],[-14.5,6030.31],[-13.5,6030.32],[-12.5,6030.34],[-11.5,6030.35],[-10.5,6026.61],[-9.5,6025.71],[-8.5,6024.82],[-7.5,6023.95],[-6.5,6024.02],[-5.5,6024.12],[-4.5,6024.18],[-3.5,6024.28],[-2.5,6024.38],[-1.5,6024.48],[-0.5,6024.54],[0.5,6024.63],[1.5,6024.73],[2.5,6024.79],[3.5,6024.86],[4.5,6024.95],[5.5,6025.01],[6.5,6025.07],[7.5,6025.03],[8.5,6025.1],[9.5,6025.07],[10.5,6025.1],[11.5,6025.14],[12.5,6025.18],[13.5,6025.31],[14.5,6026.0],[15.5,6026.78],[16.5,6028.5],[17.5,6028.29],[18.5,6028.79],[19.5,6029.49],[20.5,6030.53]],"A4.2":[[-79.5,6030.9],[-78.5,6030.89],[-77.5,6030.89],[-76.5,6030.95],[-75.5,6030.9],[-74.5,6030.85],[-73.5,6030.8],[-72.5,6030.75],[-71.5,6030.7],[-70.5,6030.65],[-69.5,6030.6],[-68.5,6030.55],[-67.5,6030.49],[-66.5,6030.44],[-65.5,6030.33],[-64.5,6030.27],[-63.5,6030.2],[-62.5,6030.14],[-61.5,6030.08],[-60.5,6030.02],[-59.5,6029.97],[-58.5,6029.91],[-57.5,6029.85],[-56.5,6029.79],[-55.5,6029.73],[-54.5,6029.68],[-53.5,6029.62],[-52.5,6029.56],[-51.5,6029.5],[-50.5,6029.44],[-49.5,6029.38],[-48.5,6029.32],[-47.5,6029.26],[-46.5,6029.2],[-45.5,6029.14],[-44.5,6029.08],[-43.5,6029.02],[-42.5,6028.95],[-41.5,6028.9],[-40.5,6028.9],[-39.5,6028.89],[-38.5,6028.91],[-37.5,6029.11],[-36.5,6029.05],[-35.5,6029.02],[-34.5,6028.94],[-33.5,6028.91],[-32.5,6028.85],[-31.5,6028.8],[-30.5,6028.74],[-29.5,6028.7],[-28.5,6028.63],[-27.5,6028.59],[-26.5,6028.52],[-25.5,6028.47],[-24.5,6028.41],[-23.5,6028.37],[-22.5,6028.3],[-21.5,6027.29],[-20.5,6027.0],[-19.5,6026.71],[-18.5,6026.43],[-17.5,6026.37],[-16.5,6026.32],[-15.5,6026.27],[-14.5,6026.22],[-13.5,6026.18],[-12.5,6026.27],[-11.5,6026.37],[-10.5,6026.47],[-9.5,6027.07],[-8.5,6027.01],[-7.5,6026.94],[-6.5,6026.88],[-5.5,6026.82],[-4.5,6026.75],[-3.5,6026.69],[-2.5,6026.62],[-1.5,6026.55],[-0.5,6025.63],[0.5,6025.34],[1.5,6025.07],[2.5,6024.78],[3.5,6024.72],[4.5,6024.69],[5.5,6024.64],[6.5,6024.63],[7.5,6024.62],[8.5,6024.76],[9.5,6024.72],[10.5,6024.66],[11.5,6024.59],[12.5,6024.51],[13.5,6024.44],[14.5,6024.37],[15.5,6024.29],[16.5,6024.22],[17.5,6024.15],[18.5,6024.06],[19.5,6023.99],[20.5,6023.91],[21.5,6023.83],[22.5,6023.75],[23.5,6023.67],[24.5,6023.58],[25.5,6023.5],[26.5,6023.41],[27.5,6023.32],[28.5,6023.24],[29.5,6023.17],[30.5,6023.12],[31.5,6023.17],[32.5,6023.23],[33.5,6023.31],[34.5,6023.85],[35.5,6023.76],[36.5,6023.68],[37.5,6022.52],[38.5,6022.15],[39.5,6021.76],[40.5,6021.38],[41.5,6021.25],[42.5,6021.17],[43.5,6021.09],[44.5,6021.01]],"A4.3":[[-19.5,6029.67],[-18.5,6028.8],[-17.5,6028.22],[-16.5,6028.5],[-15.5,6026.94],[-14.5,6026.08],[-13.5,6025.31],[-12.5,6025.18],[-11.5,6025.14],[-10.5,6025.1],[-9.5,6025.07],[-8.5,6025.1],[-7.5,6025.03],[-6.5,6025.07],[-5.5,6025.01],[-4.5,6024.95],[-3.5,6024.86],[-2.5,6024.79],[-1.5,6024.73],[-0.5,6024.63],[0.5,6024.54],[1.5,6024.48],[2.5,6024.38],[3.5,6024.28],[4.5,6024.18],[5.5,6024.12],[6.5,6024.02],[7.5,6023.95],[8.5,6024.82],[9.5,6025.71],[10.5,6026.61],[11.5,6030.35],[12.5,6030.34],[13.5,6030.32],[14.5,6030.31],[15.5,6030.3],[16.5,6030.28],[17.5,6030.28],[18.5,6027.19],[19.5,6026.4],[20.5,6025.61],[21.5,6024.81],[22.5,6024.77],[23.5,6024.74],[24.5,6024.7],[25.5,6024.66],[26.5,6024.62],[27.5,6024.59],[28.5,6024.55],[29.5,6024.51],[30.5,6024.48],[31.5,6024.44],[32.5,6024.41],[33.5,6023.63],[34.5,6023.42],[35.5,6023.21],[36.5,6023.0],[37.5,6023.0],[38.5,6022.97],[39.5,6022.93],[40.5,6022.9],[41.5,6022.88],[42.5,6022.86],[43.5,6022.83],[44.5,6022.83],[45.5,6022.8],[46.5,6022.77],[47.5,6022.75],[48.5,6022.73],[49.5,6022.7],[50.5,6022.68],[51.5,6022.66],[52.5,6022.05],[53.5,6021.86],[54.5,6021.67],[55.5,6021.5],[56.5,6021.43],[57.5,6021.4],[58.5,6021.44],[59.5,6021.54],[60.5,6021.7],[61.5,6021.97],[62.5,6022.25],[63.5,6022.53],[64.5,6023.32],[65.5,6023.25],[66.5,6023.34],[67.5,6023.56],[68.5,6023.69],[69.5,6023.85],[70.5,6024.03],[71.5,6024.17],[72.5,6024.3],[73.5,6024.42],[74.5,6024.54],[75.5,6024.69],[76.5,6024.77],[77.5,6024.88],[78.5,6025.02],[79.5,6025.1],[80.5,6025.12],[81.5,6025.17],[82.5,6025.22]],"A3.0-2":[[-81,6031.24],[-80,6031.2],[-79,6031.15],[-78,6031.11],[-77,6031.06],[-76,6031.01],[-75,6030.97],[-74,6030.92],[-73,6030.87],[-72,6030.83],[-71,6030.78],[-70,6030.73],[-69,6030.68],[-68,6030.63],[-67,6030.58],[-66,6030.53],[-65,6030.48],[-64,6030.43],[-63,6030.38],[-62,6030.33],[-61,6030.28],[-60,6030.23],[-59,6030.18],[-58,6030.13],[-57,6030.08],[-56,6030.03],[-55,6029.98],[-54,6029.92],[-53,6029.87],[-52,6029.82],[-51,6029.76],[-50,6029.71],[-49,6029.66],[-48,6029.6],[-47,6029.55],[-46,6029.5],[-45,6029.44],[-44,6029.39],[-43,6029.34],[-42,6029.28],[-41,6029.23],[-40,6029.18],[-39,6029.12],[-38,6029.07],[-37,6029.02],[-36,6028.96],[-35,6028.91],[-34,6028.85],[-33,6028.8],[-32,6028.74],[-31,6028.69],[-30,6028.63],[-29,6028.58],[-28,6028.52],[-27,6028.47],[-26,6028.41],[-25,6028.35],[-24,6028.3],[-23,6028.24],[-22,6028.18],[-21,6028.13],[-20,6028.07],[-19,6028.01],[-18,6027.96],[-17,6027.9],[-16,6027.84],[-15,6027.79],[-14,6027.73],[-13,6027.67],[-12,6027.62],[-11,6027.56],[-10,6027.5],[-9,6027.44],[-8,6027.38],[-7,6027.32],[-6,6027.27],[-5,6027.21],[-4,6027.15],[-3,6027.09],[-2,6027.03],[-1,6026.97],[0,6026.9],[1,6026.84],[2,6026.78],[3,6026.72],[4,6026.66],[5,6026.6],[6,6026.53],[7,6026.47],[8,6026.41],[9,6026.35],[10,6026.29],[11,6026.22],[12,6026.16],[13,6026.09],[14,6026.03],[15,6025.96],[16,6025.9],[17,6025.83],[18,6025.77],[19,6025.7],[20,6025.63],[21,6025.57],[22,6025.5],[23,6025.43],[24,6025.36],[25,6025.29],[26,6025.22],[27,6025.15],[28,6025.08],[29,6025.01],[30,6024.94],[31,6024.87],[32,6024.8],[33,6024.72],[34,6024.65],[35,6024.58],[36,6024.5],[37,6024.43],[38,6024.36],[39,6024.28],[40,6024.21],[41,6024.13],[42,6024.06],[43,6023.98],[44,6023.9],[45,6023.83]],"A3.0-1":[[-21,6027.21],[-20,6027.17],[-19,6027.13],[-18,6027.09],[-17,6027.05],[-16,6027.0],[-15,6026.96],[-14,6026.91],[-13,6026.87],[-12,6026.83],[-11,6026.78],[-10,6026.74],[-9,6026.7],[-8,6026.66],[-7,6026.62],[-6,6026.58],[-5,6026.54],[-4,6026.49],[-3,6026.45],[-2,6026.41],[-1,6026.37],[0,6026.33],[1,6026.29],[2,6026.25],[3,6026.21],[4,6026.17],[5,6026.13],[6,6026.09],[7,6026.05],[8,6026.01],[9,6025.97],[10,6025.93],[11,6025.89],[12,6025.85],[13,6025.82],[14,6025.78],[15,6025.74],[16,6025.71],[17,6025.67],[18,6025.63],[19,6025.6],[20,6025.56],[21,6025.52],[22,6025.49],[23,6025.45],[24,6025.42],[25,6025.38],[26,6025.35],[27,6025.31],[28,6025.28],[29,6025.25],[30,6025.21],[31,6025.18],[32,6025.15],[33,6025.12],[34,6025.08],[35,6025.05],[36,6025.02],[37,6024.99],[38,6024.96],[39,6024.93],[40,6024.9],[41,6024.87],[42,6024.84],[43,6024.81],[44,6024.78],[45,6024.75],[46,6024.72],[47,6024.69],[48,6024.66],[49,6024.63],[50,6024.6],[51,6024.58],[52,6024.55],[53,6024.52],[54,6024.49],[55,6024.47],[56,6024.44],[57,6024.41],[58,6024.38],[59,6024.35],[60,6024.32],[61,6024.29],[62,6024.26],[63,6024.24],[64,6024.21],[65,6024.18],[66,6024.15],[67,6024.12],[68,6024.08],[69,6024.05],[70,6024.02],[71,6023.99],[72,6023.96],[73,6023.92],[74,6023.89],[75,6023.85],[76,6023.82],[77,6023.78],[78,6023.75],[79,6023.71],[80,6023.67],[81,6023.63],[82,6023.59],[83,6023.54]],"A3.1-3":[[-82,6021.99],[-81,6021.99],[-80,6021.99],[-79,6021.99],[-78,6021.99],[-77,6021.98],[-76,6021.98],[-75,6021.98],[-74,6021.98],[-73,6021.98],[-72,6021.98],[-71,6021.99],[-70,6021.99],[-69,6021.99],[-68,6021.99],[-67,6021.99],[-66,6022.0],[-65,6022.0],[-64,6022.01],[-63,6022.02],[-62,6022.03],[-61,6022.04],[-60,6022.05],[-59,6022.07],[-58,6022.08],[-57,6022.09],[-56,6022.11],[-55,6022.12],[-54,6022.14],[-53,6022.16],[-52,6022.18],[-51,6022.2],[-50,6022.23],[-49,6022.25],[-48,6022.28],[-47,6022.3],[-46,6022.33],[-45,6022.36],[-44,6022.39],[-43,6022.42],[-42,6022.45],[-41,6022.49],[-40,6022.52],[-39,6022.55],[-38,6022.59],[-37,6022.62],[-36,6022.66],[-35,6022.7],[-34,6022.74],[-33,6022.78],[-32,6022.82],[-31,6022.86],[-30,6022.9],[-29,6022.95],[-28,6022.99],[-27,6023.04],[-26,6023.08],[-25,6023.13],[-24,6023.18],[-23,6023.23],[-22,6023.28],[-21,6023.33],[-20,6023.38],[-19,6023.43],[-18,6023.48],[-17,6023.54],[-16,6023.59],[-15,6023.65],[-14,6023.7],[-13,6023.76],[-12,6023.82],[-11,6023.87],[-10,6023.93],[-9,6023.99],[-8,6024.04],[-7,6024.1],[-6,6024.16],[-5,6024.22],[-4,6024.28],[-3,6024.34],[-2,6024.41],[-1,6024.47],[0,6024.53],[1,6024.59],[2,6024.65],[3,6024.71],[4,6024.78],[5,6024.84],[6,6024.9],[7,6024.97],[8,6025.03],[9,6025.09],[10,6025.16],[11,6025.22],[12,6025.28],[13,6025.34],[14,6025.4],[15,6025.46],[16,6025.53],[17,6025.59],[18,6025.65],[19,6025.72],[20,6025.78]],"A3.1-4":[[-80,6030.49],[-79,6030.43],[-78,6030.37],[-77,6030.31],[-76,6030.25],[-75,6030.18],[-74,6030.12],[-73,6030.05],[-72,6029.99],[-71,6029.92],[-70,6029.85],[-69,6029.79],[-68,6029.72],[-67,6029.65],[-66,6029.59],[-65,6029.52],[-64,6029.45],[-63,6029.38],[-62,6029.31],[-61,6029.24],[-60,6029.18],[-59,6029.11],[-58,6029.04],[-57,6028.97],[-56,6028.9],[-55,6028.83],[-54,6028.76],[-53,6028.69],[-52,6028.62],[-51,6028.55],[-50,6028.48],[-49,6028.41],[-48,6028.34],[-47,6028.27],[-46,6028.2],[-45,6028.13],[-44,6028.06],[-43,6027.99],[-42,6027.93],[-41,6027.86],[-40,6027.79],[-39,6027.72],[-38,6027.65],[-37,6027.58],[-36,6027.52],[-35,6027.45],[-34,6027.38],[-33,6027.31],[-32,6027.24],[-31,6027.17],[-30,6027.11],[-29,6027.04],[-28,6026.97],[-27,6026.91],[-26,6026.84],[-25,6026.77],[-24,6026.71],[-23,6026.64],[-22,6026.58],[-21,6026.51],[-20,6026.45],[-19,6026.38],[-18,6026.32],[-17,6026.25],[-16,6026.18],[-15,6026.12],[-14,6026.05],[-13,6025.99],[-12,6025.92],[-11,6025.86],[-10,6025.79],[-9,6025.73],[-8,6025.66],[-7,6025.59],[-6,6025.53],[-5,6025.46],[-4,6025.39],[-3,6025.33],[-2,6025.26],[-1,6025.19],[0,6025.12],[1,6025.05],[2,6024.98],[3,6024.91],[4,6024.84],[5,6024.77],[6,6024.69],[7,6024.62],[8,6024.55],[9,6024.47],[10,6024.4],[11,6024.32],[12,6024.25],[13,6024.17],[14,6024.09],[15,6024.0],[16,6023.92],[17,6023.84],[18,6023.75],[19,6023.67],[20,6023.58],[21,6023.49],[22,6023.4],[23,6023.31],[24,6023.21],[25,6023.12],[26,6023.02],[27,6022.92],[28,6022.82],[29,6022.72],[30,6022.61],[31,6022.51],[32,6022.4],[33,6022.29],[34,6022.18],[35,6022.07],[36,6021.95],[37,6021.84],[38,6021.72],[39,6021.59],[40,6021.47],[41,6021.35],[42,6021.22],[43,6021.1],[44,6020.97]]},"pts":{"A4.0":["tip","south","beam","sbeam","bridge","granny","garage","chimrib","chimribN"],"A4.1":["tip","south","beam","sbeam","bridge","granny","garage","chimrib","chimribN"],"A4.2":["tip","south","beam","sbeam","bridge","granny","garage","chimrib","chimribN"],"A4.3":["tip","south","beam","sbeam","bridge","granny","garage","chimrib","chimribN"],"A3.0-2":["beam","chimribN"],"A3.0-1":["tip","south","beam","sbeam","bridge","chimrib","chimribN"],"A3.1-3":["south","beam","sbeam","bridge","granny","garage","chimrib","chimribN"],"A3.1-4":["tip","south","beam","bridge","granny","garage","chimribN"]},"a31":{"A3.1-3":{"right":[0,-1],"fx":[0.1875,15.90688],"fy":[-0.1875,9.40625],"img_field":[0.65,3.05,18.93,6.595],"h0":-81.37,"h1":19.58999999999999},"A3.1-4":{"right":[1,0],"fx":[0.1875,15.6125],"fy":[-0.1875,17.40625],"img_field":[0.65,11.05,23.095,6.715],"h0":-79.8,"h1":43.373333333333335}},"heights":{"tip":{"name":"Living room tip","x":36.94,"z":10.72,"el":6023.0,"grade":5993.63,"over":29.37,"margin":0.63},"south":{"name":"South wing NE corner","x":30.76,"z":33.96,"el":6023.02,"grade":5993.07,"over":29.95,"margin":0.05},"beam":{"name":"Roof over the north fold beam","x":17.04,"z":-7.24,"el":6012.27,"grade":5996.08,"over":16.19,"margin":13.81},"sbeam":{"name":"Roof over the south fold beam","x":11.36,"z":56.48,"el":6017.21,"grade":5994.18,"over":23.03,"margin":6.97},"bridge":{"name":"Bridge high point","x":16.44,"z":38.64,"el":6019.16,"grade":5994.25,"over":24.91,"margin":5.09},"granny":{"name":"Granny suite roof high point","x":-21.6,"z":51.07,"el":6014.0,"grade":5996.59,"over":17.41,"margin":12.59},"garage":{"name":"Garage high point","x":-65.58,"z":17.27,"el":6017.22,"grade":6000.3,"over":16.92,"margin":13.08},"chimrib":{"name":"South chimney cap","x":24.32,"z":63.92,"el":6017.88,"grade":5992.98,"over":24.9,"margin":9.1,"limit":34.0},"chimribN":{"name":"North chimney cap","x":20.76,"z":-11.38,"el":6017.6,"grade":5996.05,"over":21.55,"margin":12.45,"limit":34.0}},"test1":{"avg":5996.99,"hi":6001.11,"lo":5992.87,"slope":6.5,"limit_ft":30,"ridge":6023.02,"limit_el":6026.99,"margin":3.97}}/*OSE:END*/;
  const DATUM = 5990, FW = 31.25, FH = 23;
  const r3 = v => +(+v).toFixed(3);
  const NS = 'vector-effect="non-scaling-stroke"';
  const INK = '#1b1a18', ACC = '#c07a2c';
  const d2 = v => (+v).toFixed(2), d1 = v => (+v).toFixed(1);

  /* ---------------------------------------------------------------- per sheet layout (field inches unless noted) */
  // grids: 'n' numbered lines (x constant), 'l' lettered lines (z constant; F and G run on the south wing skew, taken where
  // they meet faceX). strong: [A1.4 point, label x, y, side] dimensioned to the envelope; light: other A1.4 points, a hairline and a figure.
  // lv: level chains [label, [SHARED.levels ids], x] ; tags: [SHARED tag id, text x, y, side, view, el, z] (el and z when the tag has none or sits off the cut).
  const CFG = {
    'A4.0': { views: [{ v: 'A4.0', n: ['1', '2', '3', '4', '5', '7', '9', '11'], strong: [['tip', 3.85, 6.45, 'l']], light: [['garage', 'r'], ['chimribN', 'l']],
      lv: [['North wing', ['main_ff', 'main_plate', 'lower_beam', 'fold_beam'], -0.3], ['Garage', ['garage_ff', 'garage_tip'], -1.4]] }],
      tags: [['T04', 12.3, 6.55], ['T_chim_north_cap', 12.3, 6.85], ['T_W11', 12.3, 7.15]], leg: [11.6, 13.55] },
    'A4.1': { views: [{ v: 'A4.1', l: ['A', 'B', 'D', 'E', 'F', 'G'], faceX: 25.8, strong: [['tip', 23.35, 6.25, 'r'], ['south', 11.55, 5.88, 'l']], light: [],
      lv: [['South wing', ['lower_ff', 'main_ff', 'primary_ff', 'primary_plate', 'south_beam'], -0.25]] }],
      tags: [['T17', 2.3, 7.3], ['T18', 2.3, 7.6], ['T_W12', 2.3, 7.9], ['T_W10', 16.9, 7.1, 'l'], ['T_W2', 23.35, 6.95]], leg: [11.6, 15.55] },
    'A4.2': { views: [{ v: 'A4.2', n: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], strong: [['south', 22.4, 6.55, 'l'], ['tip', 25.3, 7.05, 'r']], light: [['chimrib', 'l'], ['granny', 'l'], ['garage', 'r']],
      lv: [['South wing', ['lower_ff', 'main_ff', 'primary_ff', 'primary_plate', 'south_beam'], -0.3], ['Granny suite', ['main_ff', 'granny_head', 'granny_beam'], -1.4]] }],
      tags: [['T14', 4.0, 6.35], ['T13', 4.0, 6.65], ['T04', 11.4, 6.35], ['T_W1', 11.4, 6.65], ['T_W13', 11.4, 6.95], ['T_chim_south_cap', 11.4, 7.25]], leg: [11.6, 13.62] },
    'A4.3': { views: [{ v: 'A4.3', l: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], faceX: -20.58, strong: [['tip', 8.95, 6.35, 'l'], ['south', 15.75, 6.35, 'r']], light: [['garage', 'l'], ['granny', 'r']],
      lv: [['North wing', ['main_ff', 'main_plate', 'bridge_beam', 'fold_beam'], -0.25]] }],
      tags: [['T_W7', 20.3, 6.95]], leg: [11.6, 14.45] },
    'A3.0': { views: [
      { v: 'A3.0-2', n: ['1', '2', '3', '4', '5', '7', '9', '11'], strong: [], light: [['beam', 'r'], ['chimribN', 'l']], bubY: 3.62,
        lv: [['', ['main_ff', 'main_plate', 'lower_beam', 'fold_beam'], { h: 29 }]] },
      { v: 'A3.0-1', l: ['A', 'B', 'D', 'E', 'F', 'G'], faceX: 8.0, strong: [['tip', 5.85, 11.55, 'l'], ['south', 11.3, 11.45, 'r']], light: [['chimrib', 'r']],
        lv: [['', ['main_ff', 'bridge_beam'], { h: 21 }], ['', ['lower_ff', 'primary_ff', 'primary_plate'], { h: 63.5 }]] }],
      tags: [['T10', 4.0, 6.2, 'r', 'A3.0-2', 6002.0], ['T_chim_north_cap', 20.35, 3.98, 'r', 'A3.0-2'], ['T_chim_south_cap', 17.3, 11.35, 'r', 'A3.0-1']], leg: [26.95, 3.55] },
    'A3.1': { views: [
      { v: 'A3.1-3', l: ['A', 'B'], faceX: 34.0, strong: [['south', 9.85, 3.72, 'r']], light: [], bubY: 2.83 },
      { v: 'A3.1-4', n: ['4', '6', '8', '10'], strong: [['south', 21.05, 11.75, 'l'], ['tip', 22.85, 11.8, 'r']], light: [], beyond: ['8'], bubY: 10.6 }],
      tags: [['T19', 11.6, 11.95, 'r', 'A3.1-4', 6010.67, 52.0]], leg: null },
  };
  const SHORT = { lower_ff: 'Lower', main_ff: 'Main', primary_ff: 'Primary', garage_ff: 'Garage', main_plate: 'Plate', primary_plate: 'Plate', fold_beam: 'Fold beam',
    south_beam: 'Beam', lower_beam: 'Sill', bridge_beam: 'Bridge beam', granny_beam: 'Beam', granny_head: 'Glass head', garage_tip: 'Roof tip' };
  const LBL = { tip: 'Tip', south: 'NE corner', bridge: 'Bridge high point', granny: 'Granny suite', garage: 'Garage', chimrib: 'South chimney cap', chimribN: 'North chimney cap', beam: 'Roof over the fold beam', sbeam: 'Roof over the south beam' };
  const TAGTXT = { T01: 'VII.5 tip 29.37 ft over grade', T02: 'VII.5 29.95 ft, the tightest point' };   // A1.4 figures

  /* ---------------------------------------------------------------- projection */
  function frame(S, name) {
    const c = (S.coords && S.coords.views && S.coords.views[name]) || OSE.a31[name];
    if (!c) return null;
    const h = (x, z) => x * c.right[0] + z * c.right[1];
    return { c, h, X: hh => c.fx[0] * hh + c.fx[1], Y: el => c.fy[0] * (el - DATUM) + c.fy[1], img: c.img_field,
      P: (x, el, z) => [c.fx[0] * h(x, z) + c.fx[1], c.fy[0] * (el - DATUM) + c.fy[1]] };
  }
  function gridsOf(S) {
    const num = {}, let_ = {};
    ((S.grids && S.grids.grids) || []).forEach(g => {
      (g.num || []).forEach(l => { if (num[l.id] == null) num[l.id] = l.at != null ? l.at : l.a[0]; });
      (g.let || []).forEach(l => { const len = Math.hypot(l.b[0] - l.a[0], l.b[1] - l.a[1]); if (!let_[l.id] || len > let_[l.id].len) let_[l.id] = { ...l, len }; });
    });
    const zAt = (id, x) => { const l = let_[id]; if (!l) return null; if (l.at != null && Math.abs(l.a[1] - l.b[1]) < 1e-6) return l.at;
      const lo = Math.min(l.a[0], l.b[0]), hi = Math.max(l.a[0], l.b[0]), xx = Math.min(Math.max(x, lo), hi);
      return l.a[1] + (l.b[1] - l.a[1]) * (xx - l.a[0]) / (l.b[0] - l.a[0]); };
    return { num, let_, zAt, skew: id => let_[id] && Math.abs(let_[id].a[1] - let_[id].b[1]) > 1e-6 };
  }
  const levelOf = (S, id) => (S.levels || []).find(l => l.id === id);

  /* ---------------------------------------------------------------- drawing kit: svg in field inches, type in spans */
  const ln = (d, st) => `<path d="${d}" fill="none" ${st} ${NS}/>`;
  const Mv = pts => 'M' + pts.map(p => `${r3(p[0])} ${r3(p[1])}`).join(' L');
  const T = (U, x, y, cls, html, st) => `<span class="ot ${cls}" style="left:${U(x)};top:${U(y)};${st || ''}">${html}</span>`;
  const slash = (x, y, k) => ln(`M${r3(x - .055)} ${r3(y + .055)} L${r3(x + .055)} ${r3(y - .055)}`, `stroke="${k || INK}" stroke-width="1.1"`);

  function viewLayer(ctx, S, cfg, G, vis, out) {
    const { U, esc } = ctx, F = frame(S, cfg.v);
    if (!F) return;
    const [ix, iy, iw, ih] = F.img, ib = iy + ih, right = ix + iw;
    const bubY = cfg.bubY != null ? cfg.bubY : iy - 0.24, rB = 0.14;
    // ---- grids: hairline from the bubble down past grade into the earth, bubbles on top, spacing string in the earth band
    const lines = [];
    (cfg.n || []).forEach(id => { const x = G.num[id]; if (x != null) lines.push({ id, h: F.c.right[0] ? x * F.c.right[0] : null }); });
    (cfg.l || []).forEach(id => { const z = G.zAt(id, cfg.faceX); if (z != null) lines.push({ id, h: F.c.right[1] ? z * F.c.right[1] : null, skew: G.skew(id) }); });
    const gl = lines.filter(l => l.h != null).map(l => ({ ...l, fx: F.X(l.h) })).filter(l => l.fx > ix + 0.05 && l.fx < right - 0.05).sort((a, b) => a.fx - b.fx);
    const yS = ib - 0.36, yO = ib - 0.13;
    gl.forEach(l => {
      const beyond = (cfg.beyond || []).includes(l.id);
      out.svg += ln(`M${r3(l.fx)} ${r3(bubY + rB)} V${r3(ib - 0.04)}`, `stroke="${INK}" stroke-width="0.55" stroke-dasharray="9 3 1.5 3" opacity="${beyond ? .3 : .42}"`);
      out.svg += `<circle cx="${r3(l.fx)}" cy="${r3(bubY)}" r="${rB}" fill="#f6f3ec" fill-opacity=".9" stroke="${INK}" stroke-width="0.7" ${NS}/>`;
      out.txt += T(U, l.fx, bubY, 'gb', esc(l.id));
      if (l.skew || beyond) out.txt += T(U, l.fx, bubY - rB - 0.03, 'gs', beyond ? 'beyond' : 'at the face');
    });
    for (let k = 1; k < gl.length; k++) {
      const a = gl[k - 1], b = gl[k], ft = Math.abs(b.h - a.h);
      if (b.fx - a.fx < 0.42) continue;
      out.txt += T(U, (a.fx + b.fx) / 2, yS - 0.075, 'gd', esc(S.ftin(ft)));
    }
    if (gl.length > 1) {
      const a = gl[0], b = gl[gl.length - 1];
      out.svg += ln(`M${r3(a.fx)} ${r3(yS)} H${r3(b.fx)}`, `stroke="${INK}" stroke-width="0.5" opacity=".7"`);
      gl.forEach(l => { out.svg += slash(l.fx, yS); });
    }
    if (gl.length > 2) {
      const a = gl[0], b = gl[gl.length - 1];
      out.svg += ln(`M${r3(a.fx)} ${r3(yO)} H${r3(b.fx)}`, `stroke="${INK}" stroke-width="0.5" opacity=".7"`);
      out.svg += slash(a.fx, yO) + slash(b.fx, yO);
      out.txt += T(U, (a.fx + b.fx) / 2, yO - 0.075, 'gd o2', `${esc(S.ftin(Math.abs(b.h - a.h)))} <small>overall, grid ${esc(a.id)} to ${esc(b.id)}</small>`);
    }
    // ---- the 30 ft envelope over natural grade, clipped under the bubble row and inside the frame
    const env = (OSE.env[cfg.v] || []).map(([h, e]) => [F.X(h), F.Y(e)]).filter(p => p[0] >= ix - 0.01 && p[0] <= right + 0.01);
    const clipTop = bubY + rB + 0.12, cid = `ose-c-${cfg.v.replace('.', '_')}`;
    out.defs += `<clipPath id="${cid}"><rect x="${r3(ix)}" y="${r3(clipTop)}" width="${r3(iw)}" height="${r3(ib - clipTop)}"/></clipPath>`;
    if (env.length > 1 && !cfg.noEnv) {
      out.svg += `<g clip-path="url(#${cid})">${ln(Mv(env), `stroke="${ACC}" stroke-width="1" stroke-dasharray="7 4" opacity=".95"`)}</g>`;
      // label at the calmest stretch near a quarter of the way in, just over the line
      const at = env[Math.round(env.length * (cfg.envAt != null ? cfg.envAt : 0.06))];
      if (at && at[1] > clipTop + 0.1) out.txt += T(U, at[0], at[1] - 0.1, 'el', `30 ft over natural grade`);
    }
    // where the line runs above the frame for most of the view, say so and give its range
    const above = env.filter(p => p[1] < clipTop), els = (OSE.env[cfg.v] || []).map(q => q[1]);
    if (env.length && above.length / env.length > 0.6 && !cfg.noEnv)
      out.txt += T(U, ix + 0.35, clipTop + 0.02, 'el', `30 ft over natural grade runs above, about ${Math.round(Math.min(...els))} to ${Math.round(Math.max(...els))}`);
    // ---- A1.4 points: strong ones dimensioned from the grade beneath to the envelope, light ones a hairline and a figure
    const H = OSE.heights, onv = OSE.pts[cfg.v] || [];
    (cfg.strong || []).forEach(([k, tx, ty, side]) => {
      const p = H[k]; if (!p || !onv.includes(k)) return;
      const [x, yR] = F.P(p.x, p.el, p.z), yG = F.Y(p.grade), yE = F.Y(p.grade + 30);
      out.svg += ln(`M${r3(x)} ${r3(yG)} V${r3(yE)}`, `stroke="${ACC}" stroke-width="0.9"`) + slash(x, yG, ACC) + slash(x, yE, ACC);
      if (yE - 0.05 > bubY + rB + 0.12) out.svg += ln(`M${r3(x)} ${r3(yE - 0.05)} V${r3(bubY + rB + 0.06)}`, `stroke="${ACC}" stroke-width="0.5" opacity=".5"`);   // the datum run rising off the peak
      out.svg += ln(`M${r3(x - .12)} ${r3(yE)} H${r3(x + .12)}`, `stroke="${ACC}" stroke-width="0.6"`);
      out.svg += `<circle cx="${r3(x)}" cy="${r3(yR)}" r=".045" fill="${ACC}"/>`;
      const cl = side === 'l' ? 'l' : 'r';
      // the figure sits in open sky with a hairline back to the dimension
      const kx = tx + (cl === 'l' ? 0.06 : -0.06), ky = Math.max(yE + 0.08, Math.min(ty, yG - 0.2));
      out.svg += ln(`M${r3(kx)} ${r3(ty)} L${r3(x)} ${r3(ky)}`, `stroke="${ACC}" stroke-width="0.45" opacity=".7"`);
      out.txt += T(U, tx, ty, `hd ${cl}`, `<b>${d2(p.over)} ft</b><i>${d2(p.margin)} ft to spare</i><u>${esc(LBL[k] || p.name)} · A1.4 · <span class="sd meets"></span><b class="rn">4</b></u>`);
      out.txt += T(U, x + (cl === 'l' ? -0.07 : 0.07), yG + 0.09, `ht ${cl}`, `grade beneath ${d1(p.grade)}`);
    });
    (cfg.light || []).forEach(([k, side]) => {
      const p = H[k]; if (!p || !onv.includes(k)) return;
      const [x, yR] = F.P(p.x, p.el, p.z), yG = F.Y(p.grade);
      const chim = k.startsWith('chim');
      out.svg += ln(`M${r3(x)} ${r3(yG)} V${r3(yR)}`, `stroke="${ACC}" stroke-width="0.5" stroke-dasharray="1.5 2.5" opacity=".75"`) + slash(x, yG, ACC);
      out.svg += `<circle cx="${r3(x)}" cy="${r3(yR)}" r=".03" fill="${ACC}"/>`;
      const cl = side === 'l' ? 'l' : 'r', s = side === 'l' ? -1 : 1;
      out.txt += T(U, x + s * 0.07, yR - (chim ? 0.2 : 0.11), `hl ${cl}`, `<b>${d1(p.over)} ft</b> ${chim ? `of ${p.limit || 34}` : 'over grade'}`);
    });
    // ---- level chains: finish floor to plate and beam. In the margin left of an elevation, inside the cut on a section
    (cfg.lv || []).forEach(([label, ids, where]) => {
      const L = ids.map(id => levelOf(S, id)).filter(Boolean).sort((a, b) => a.el - b.el);
      if (L.length < 2) return;
      const inside = typeof where === 'object';
      const x = inside ? F.X(where.h) : ix + where;
      const ys = L.map(l => F.Y(l.el));
      out.svg += ln(`M${r3(x)} ${r3(ys[0])} V${r3(ys[ys.length - 1])}`, `stroke="${INK}" stroke-width="0.5" opacity=".75"`);
      ys.forEach(y => {
        out.svg += slash(x, y);
        if (!inside) out.svg += ln(`M${r3(x + 0.08)} ${r3(y)} H${r3(ix + 0.4)}`, `stroke="${INK}" stroke-width="0.45" stroke-dasharray="2 4" opacity=".4"`);
      });
      const side = inside ? 'r' : 'l', s = side === 'l' ? -1 : 1;
      L.forEach((l, k) => {
        out.txt += T(U, x + s * 0.07, ys[k] - 0.06, `lvn ${side}`, `${esc(SHORT[l.id] || l.name)} <i>${d1(l.el)}</i>`);
        if (k) out.txt += T(U, x + s * 0.07, (ys[k] + ys[k - 1]) / 2 + 0.03, `lvd ${side}`, esc(S.ftin(l.el - L[k - 1].el)));
      });
      if (label) out.txt += T(U, x, ys[ys.length - 1] - 0.24, 'lvh', esc(label));
    });
  }

  function tagLayer(ctx, S, sheet, cfg, out) {
    const { U, esc } = ctx, tags = (S.tags && S.tags.tags) || [];
    (cfg.tags || []).forEach(([id, tx, ty, side, vname, elx, zx]) => {
      const t = tags.find(q => q.id === id); if (!t) return;
      let a = t.at_field && t.at_field[vname || sheet];
      const F = frame(S, vname || sheet);
      if ((!a || elx) && F) { const el = elx || t.el || (id === 'T04' ? 6016.0 : 6008.5); a = F.P(t.at[0], el, zx != null ? zx : t.at[1]); }
      if (!a) return;
      const cl = side === 'l' ? 'l' : 'r', kx = tx + (cl === 'l' ? 0.06 : -0.06);
      out.svg += ln(`M${r3(kx)} ${r3(ty)} Q${r3(kx + (a[0] - kx) * .15)} ${r3(ty + (a[1] - ty) * .85)} ${r3(a[0])} ${r3(a[1])}`, `stroke="${ACC}" stroke-width="0.5" opacity=".8"`);
      out.svg += `<circle cx="${r3(a[0])}" cy="${r3(a[1])}" r=".04" fill="${ACC}"/>`;
      const row = t.a13 ? `<b class="rn">${t.a13.n}</b>` : '';
      out.txt += T(U, tx, ty, `tg ${cl}`, `<span class="sd ${t.status}"></span>${row}<em>${esc(TAGTXT[id] || t.text)}</em>`);
    });
  }

  function legend(ctx, S, cfg, sheet) {
    if (!cfg.leg) return '';
    const { U, esc } = ctx, t1 = OSE.test1 || {}, sc = OSE.heights.south || {};
    const n = sheet.startsWith('A3') ? 'section' : 'elevation';
    return `<div class="oleg" style="left:${U(cfg.leg[0])};top:${U(cfg.leg[1])}">
      <h4>Overlay · grids, height, compliance</h4>
      <ul>
        <li><svg viewBox="0 0 30 10"><path d="M2 5 H22" stroke="${INK}" stroke-width=".8" stroke-dasharray="6 2 1 2" opacity=".6"/><circle cx="26" cy="5" r="3.6" fill="none" stroke="${INK}" stroke-width=".8"/></svg>Grid, as the plans</li>
        <li><svg viewBox="0 0 30 10"><path d="M1 6 Q15 3 29 5" stroke="${ACC}" stroke-width="1" stroke-dasharray="5 3" fill="none"/></svg>30 ft over natural grade</li>
        <li><svg viewBox="0 0 30 10"><path d="M15 1 V9 M12 3.5 L18 -1.5 M12 11.5 L18 6.5" stroke="${ACC}" stroke-width="1"/></svg>Height over the grade beneath</li>
        <li><span class="sd meets"></span>meets <span class="sd confirm"></span>confirm <span class="sd variance"></span>variance <b class="rn">7</b>A1.3 row</li>
      </ul>
      <h4>Max height · VII.5</h4>
      <ol>
        <li>Natural grade, before grading, from the model terrain. Confirm on survey.</li>
        <li>Every point measured straight down to the grade beneath it, never over 30 ft. The ${n} shows it at true scale.</li>
        <li>Ridge ${d1(t1.ridge)} within 30 ft of average grade ${d1(t1.avg)}, limit ${d1(t1.limit_el)}. Slope ${t1.slope}%, so 30 ft governs.</li>
        <li>Chimney masses may rise 4 ft more, caps excluded.</li>
        <li>Tightest: the south wing NE corner, ${d2(sc.over)} ft, ${d2(sc.margin)} to spare. Heights from A1.4.</li>
      </ol></div>`;
  }

  function mobile(ctx, S, cfg, sheet) {
    const { esc } = ctx, tags = (S.tags && S.tags.tags) || [], H = OSE.heights;
    const pts = [...new Set(cfg.views.flatMap(v => (v.strong || []).map(s => s[0])))].map(k => H[k]).filter(Boolean);
    const rows = pts.map(p => `<li><span class="sd meets"></span>${esc(p.name)} <i>${d2(p.over)} ft over the grade beneath, ${d2(p.margin)} to spare</i></li>`).join('') +
      (cfg.tags || []).map(([id]) => tags.find(q => q.id === id)).filter(Boolean).map(t => `<li><span class="sd ${t.status}"></span>${t.a13 ? `<b class="rn">${t.a13.n}</b>` : ''}${esc(TAGTXT[t.id] || t.text)}</li>`).join('');
    return `<div class="osm"><h4>Height and compliance</h4><ul>${rows}</ul><p>Grids, dimensions and the 30 ft envelope print on the full sheet.</p></div>`;
  }

  const CSS = `<style>
    .ose,.ose .osd{position:absolute;inset:0;pointer-events:none}
    .ose .osv{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
    .ose .ot{position:absolute;white-space:nowrap;line-height:1.05;pointer-events:none;transform:translate(-50%,-50%)}
    .ose .ot.gb{font:400 max(calc(7px * var(--fl)),calc(var(--u) * .12))/1 var(--ft);letter-spacing:.02em;color:var(--ink)}
    .ose .ot.gs{transform:translate(-50%,-100%);font:italic 400 max(calc(6px * var(--fl)),calc(var(--u) * .075))/1 var(--fs);color:var(--muted)}
    .ose .ot.gd{transform:translate(-50%,-50%);font:italic 400 max(calc(7.5px * var(--fl)),calc(var(--u) * .105))/1 var(--fs);color:var(--ink)}
    .ose .ot.gd small{font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .065))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-left:.4em}
    .ose .ot.el{transform:translate(0,-50%);font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .07))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}
    .ose .ot.hd{display:flex;flex-direction:column;gap:.12em;transform:translate(0,-50%)}
    .ose .ot.hd.l{transform:translate(-100%,-50%);align-items:flex-end;text-align:right}
    .ose .ot.hd > b{font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .16))/1 var(--fs);color:var(--accent)}
    .ose .ot.hd i{font:italic 400 max(calc(6.5px * var(--fl)),calc(var(--u) * .09))/1 var(--fs);color:var(--ink)}
    .ose .ot.hd u{display:inline-flex;align-items:center;gap:.4em;text-decoration:none;font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .062))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .ose .ot.hd,.ose .ot.hl,.ose .ot.tg,.ose .ot.lvn,.ose .ot.lvd{text-shadow:0 0 2px #f6f3ec,0 0 3px #f6f3ec}
    .ose .ot.ht{transform:translate(0,-50%);font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .062))/1 var(--ft);letter-spacing:.12em;text-transform:uppercase;color:var(--accent);opacity:.9}
    .ose .ot.ht.l,.ose .ot.hl.l,.ose .ot.lvn.l,.ose .ot.lvd.l{transform:translate(-100%,-50%);text-align:right}
    .ose .ot.hl{transform:translate(0,-50%);font:italic 400 max(calc(6.5px * var(--fl)),calc(var(--u) * .095))/1 var(--fs);color:var(--ink)}
    .ose .ot.hl b{font-weight:400;color:var(--accent)}
    .ose .ot.lvn{transform:translate(0,-50%);font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .062))/1 var(--ft);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .ose .ot.lvn i{font:italic 400 max(calc(6.5px * var(--fl)),calc(var(--u) * .085))/1 var(--fs);letter-spacing:0;text-transform:none;color:var(--ink)}
    .ose .ot.lvd{transform:translate(0,-50%);font:italic 400 max(calc(7px * var(--fl)),calc(var(--u) * .1))/1 var(--fs);color:var(--ink)}
    .ose .ot.lvh{transform:translate(-50%,-50%);font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .065))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--ink)}
    .ose .ot.tg{display:flex;align-items:center;gap:.35em;transform:translate(0,-50%);font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .068))/1 var(--ft);letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
    .ose .ot.tg.l{transform:translate(-100%,-50%);flex-direction:row-reverse}
    .ose .ot.tg em{font-style:normal}
    .ose .ot.tg i{font:italic 400 max(calc(6.5px * var(--fl)),calc(var(--u) * .085))/1 var(--fs);letter-spacing:0;text-transform:none;color:var(--ink)}
    .ose .sd{display:inline-block;flex:none;width:max(calc(5px * var(--fl)),calc(var(--u) * .075));height:max(calc(5px * var(--fl)),calc(var(--u) * .075));border-radius:50%;box-sizing:border-box;vertical-align:middle}
    .ose .sd.meets{background:var(--ink)}
    .ose .sd.confirm{border:1px solid var(--accent);background:transparent}
    .ose .sd.variance{background:var(--accent)}
    .ose .rn{display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:max(calc(9px * var(--fl)),calc(var(--u) * .13));height:max(calc(8px * var(--fl)),calc(var(--u) * .115));padding:0 .3em;border:1px solid currentColor;border-radius:2px;box-sizing:border-box;font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .07))/1 var(--ft);letter-spacing:0;color:var(--accent)}
    .ose .oleg{position:absolute;width:calc(var(--u) * 3.6);pointer-events:none;color:var(--ink)}
    .ose .oleg h4{margin:0 0 calc(var(--u) * .05);font:400 max(calc(6px * var(--fl)),calc(var(--u) * .075))/1.2 var(--ft);letter-spacing:.18em;text-transform:uppercase}
    .ose .oleg ul,.ose .oleg ol{margin:0 0 calc(var(--u) * .12);padding:0;list-style:none}
    .ose .oleg li{display:flex;align-items:center;gap:.4em;font:italic 400 max(calc(6.5px * var(--fl)),calc(var(--u) * .085))/1.25 var(--fs);color:var(--ink)}
    .ose .oleg li svg{width:calc(var(--u) * .3);height:calc(var(--u) * .1);flex:none;overflow:visible}
    .ose .oleg li .rn{margin-left:.6em}
    .ose .oleg li .sd{margin-left:.25em}
    .ose .oleg li .sd:first-child{margin-left:0}
    .ose .oleg ol{counter-reset:m}
    .ose .oleg ol li{display:block;counter-increment:m;padding-left:1.1em;text-indent:-1.1em;margin-bottom:.12em}
    .ose .oleg ol li::before{content:counter(m) ".";display:inline-block;width:1.1em;text-indent:0;font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .065))/1 var(--ft);color:var(--accent)}
    .ose .osm{display:none}
    .sheet[data-id^="A4."] .dv .dov path[stroke-dasharray="6 4"],.sheet[data-id^="A4."] .dv .lbl.lim{display:none}
    @media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
      .fover:has(> .ose){position:relative;inset:auto;margin:0 0 20px}
      .ose{position:relative;inset:auto}
      .ose .osd{display:none}
      .ose .osm{display:block;font:italic 400 15px/1.35 var(--fs);color:var(--ink)}
      .ose .osm h4{margin:0 0 6px;font:400 10px/1.2 var(--ft);letter-spacing:.18em;text-transform:uppercase}
      .ose .osm ul{margin:0;padding:0;list-style:none}
      .ose .osm li{display:block;padding:3px 0;white-space:normal}
      .ose .osm li .sd,.ose .osm li .rn{margin-right:7px}
      .ose .osm li i{color:var(--muted)}
      .ose .osm .sd{width:7px;height:7px;transform:translateY(-1px)}
      .ose .osm .rn{width:15px;height:15px;font-size:8px}
      .ose .osm p{margin:6px 0 0;font-size:13px;color:var(--muted)}
    }
  </style>`;

  Object.keys(CFG).forEach(sheet => {
    LIVING_OVERLAYS.push({ id: sheet, z: 5, html: ctx => {
      const S = ctx.SHARED || window.SHARED;
      if (!S || !S.coords || !OSE.env) return '';
      const cfg = CFG[sheet], G = gridsOf(S), out = { svg: '', txt: '', defs: '' };
      cfg.views.forEach(v => viewLayer(ctx, S, v, G, null, out));
      tagLayer(ctx, S, sheet, cfg, out);
      const svg = `<svg class="osv" viewBox="0 0 ${FW} ${FH}" preserveAspectRatio="none" aria-hidden="true"><defs>${out.defs}</defs>${out.svg}</svg>`;
      return `${CSS}<div class="ose"><div class="osd">${svg}${out.txt}${legend(ctx, S, cfg, sheet)}</div>${mobile(ctx, S, cfg, sheet)}</div>`;
    } });
  });
})();
