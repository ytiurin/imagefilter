// imageData is typeof ImageData
function applyFilter( imageData, filterMatrix )
{
  var height = imageData.height
  var width = imageData.width
  imageData = imageData.data

  var newImageData = new ImageData( width, height);

  var wN = filterMatrix.length
  var wC = ( filterMatrix.length / 2 ) << 0
  // Flatten filterMatrix to 1D array
  var weights = filterMatrix.reduce(( res, row ) => res.concat( row ), [] )
  // Iterate throught image subpixels
  for ( var gi = 0; gi < imageData.length; gi++ ) {
    var go = ( gi % 4 )
    var pi = ( gi / 4 ) << 0
    // SKIP ALPHA CHANNEL VALUE
    if ( go === 3 ) {
      newImageData.data[ gi ] = imageData[ gi ]
      continue
    }
    var iY = ( pi / width ) << 0
    var iX = ( pi % width )
    var grades = []
    var newGrade = 0.5
    // Iterate weights row
    for ( var wY = 0; wY < wN; wY++ ) {
      var gY = iY + wY - wC
      gY = gY < 0 ? 0 : ( gY >= height ? height - 1 : gY )
      // continue
      // Iterate weights column in row
      for ( var wX = 0; wX < wN; wX++ ) {
        var gX = iX + wX - wC
        gX = gX < 0 ? 0 : ( gX >= width ? width - 1 : gX )
        // MULT SUBPIXEL WITH THE FILTER WEIGHT
        // AND SUM THE RESULT
        newGrade += imageData[ gY * width * 4 + gX * 4 + go ]
          * weights[ wY * wN + wX ]
      }
    }
    newImageData.data[ gi ] = newGrade
  }

  return newImageData
}
