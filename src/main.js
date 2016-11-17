import SaveFiles from './SaveFiles';
import Selections from './Selections';
import Colors from './Colors';
import Logging from './Logging';

let doc = app.activeDocument,
    jobnumber = prompt('Job Number: ', '123456P01'),
    materialWidth = 54,
    panelSelection = new Selections,
    fullWidth = parseInt(doc.width),
    fullHeight = parseInt(doc.height),
    res = doc.resolution,
    overlap = 2,
    overlapWidth = overlap * res,
    availableMaterial = (materialWidth - 1) - overlap,
    numPanels = Math.ceil(fullWidth / availableMaterial),
    panelWidth = (fullWidth / numPanels) * res,
    error = '';
    colors = new Colors(),
    saveAsTif = new SaveFiles(
      File(`G33STORE-1/WIP/${jobnumber}/prep_art/${jobnumber}panels.tif`)
    );

    alert(`Panels: ${numPanels} | Width: ${(panelWidth/res).toFixed(2)}`);

    black = colors.solidColor(0, 0, 0, 100);
    red = colors.solidColor(0, 100, 100, 0);

function createMarks(layerName, opacity, color, markWidth, offsetX) {
    let newLayer = doc.artLayers.add();

    newLayer.name = layerName;
    doc.activeLayer.fillOpacity = opacity;

    for(let i = 1; i < numPanels; i ++) {
        let x = i * offsetX,
            y = 0,
            width = markWidth,
            height = fullHeight * res;
            selectedRegion = panelSelection.selection(x, y, width, height);
        doc.selection.select(selectedRegion);
        doc.selection.fill(color);
    }
}
try {
    createMarks('Overlap', 50, red, overlapWidth, panelWidth);
    createMarks('Panel Breaks', 100, black, 3, panelWidth);
    saveAsTif.saveTIF();
} catch(e) {
    error += `Line: ${e.line.toString()}, ${e.name.toString()}, ${e.message.toString()}.`;

    alert('There was an error...');
}

let log = new Logging(jobnumber, 'Joe', error);
log.logger();
