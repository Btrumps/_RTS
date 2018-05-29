const GAME_FONT = '22pt Sevastopol-Interface';
const GAME_UI_FONT = '20pt Sevastopol-Interface';
const GAME_UI_FONT_SMALL = '16pt Sevastopol-Interface';
const GAME_UI_FONT_SMALLEST = '14pt Sevastopol-Interface';
const GAME_UI_HEALTH_BAR_TEXT = '12pt Sevastopol-Interface';

const FULL_ALPHA = 1;

function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng, opacity) {
   canvasContext.save();
   canvasContext.globalAlpha = opacity;
   canvasContext.translate(atX, atY);
   canvasContext.rotate(withAng);
   canvasContext.drawImage(useBitmap,-useBitmap.width/2,-useBitmap.height/2);
   // canvasContext.globalAlpha = 1.0; how we'd restore it if we didn't have the .restore
   canvasContext.restore();
}

function drawDottedLine(hereX, hereY, thereX, thereY, fillColor) {
	canvasContext.beginPath();
    canvasContext.moveTo(hereX, hereY);
    canvasContext.lineTo(thereX, thereY);
    canvasContext.strokeStyle = fillColor;
    canvasContext.setLineDash([5, 15]);
    canvasContext.stroke();
}

function colorRect (topLeftX, topLeftY, boxWidth, boxHeight, fillColor, opacity) {
	canvasContext.fillStyle = fillColor;
	canvasContext.globalAlpha = opacity;
	canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
	canvasContext.globalAlpha = 1.0;
}

function colorCircle (centerX, centerY, radius, fillColor) {
	canvasContext.strokeStyle = fillColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY, radius, 0, Math.PI*2, true);
	canvasContext.stroke();
}

function coloredOutlineRectCornerToCorner (corner1X, corner1Y, corner2X, corner2Y, lineColor) {
	canvasContext.strokeStyle = lineColor;
	canvasContext.beginPath();
	canvasContext.setLineDash([]);
	// by subtracting the 2nd X/Y from the 1st X/Y, we translate into variable width and height values  
	canvasContext.rect(corner1X, corner1Y, corner2X-corner1X, corner2Y-corner1Y);
	canvasContext.stroke();
}

function colorText (showWords, textX, textY, fillColor, fontName) {
	canvasContext.font = fontName;
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}

function noColorText (showWords, textX, textY, fontName) {
	canvasContext.font = fontName;
	canvasContext.fillText(showWords, textX, textY);
}