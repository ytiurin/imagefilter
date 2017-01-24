// imageData is 1D array of RGB values
function applyFilter( imageData, height, width, weights )
{
  var newIMG = []
  var wN = weights.length
  var wC = ( weights.length / 2 ) << 0
  // Flatten weights to 1D array
  weights = weights.reduce( function( res, row ) {
    return res.concat( row ), [] })
  // Iterate throught image subpixels
  for ( var gi = 0; gi < imageData.length; gi++ ) {
    var pi = ( gi / 3 ) << 0
    var go = ( gi % 3 )
    var iY = ( pi / width ) << 0
    var iX = ( pi % width )
    var grades = []
    // Iterate weights row
    for ( var wY = 0; wY < wN; wY++ ) {
      var gY = iY + wY - wC
      gY = gY < 0 ? 0 : ( gY >= height ? height - 1 : gY )
      // Iterate weights column in row
      for ( var wX = 0; wX < wN; wX++ ) {
        var gX = iX + wX - wC
        gX = gX < 0 ? 0 : ( gX >= width ? width - 1 : gX )
        // Get subpixel from and save it
        // for further aggregation
        grades.push( imageData[ gY * width * 3 + gX * 3 + go ] )
      }
    }
    // Combine grades with weights and
    // sum the result
    var newGrade = grades.reduce( function( res, grade, i ) {
        return res + grade * weights[ i ], 0.5 }) << 0
    // Bound result to 0-255 range
    newIMG.push( newGrade < 0 ? 0 : ( newGrade > 255 ? 255 : newGrade ))
  }

  return newIMG
}
