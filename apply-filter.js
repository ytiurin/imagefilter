(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.applyFilter = factory();
  }
}(this, function () {

  return function( imageData, filterMatrix ) {
    var width = imageData.width
    var height = imageData.height
    imageData = imageData.data

    var newImageData = new ImageData( width, height )

    var fN = filterMatrix.length
    var fC = ( filterMatrix.length / 2 ) << 0
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
      for ( var fY = 0; fY < fN; fY++ ) {
        var gY = iY + fY - fC
        gY = gY < 0 ? 0 : ( gY >= height ? height - 1 : gY )
        // continue
        // Iterate weights column in row
        for ( var fX = 0; fX < fN; fX++ ) {
          var gX = iX + fX - fC
          gX = gX < 0 ? 0 : ( gX >= width ? width - 1 : gX )
          // MULT SUBPIXEL WITH THE FILTER WEIGHT
          // AND SUM THE RESULT
          newGrade += imageData[ gY * width * 4 + gX * 4 + go ]
            * filterMatrix[ fY ][ fX ]
        }
      }
      newImageData.data[ gi ] = newGrade
    }

    return newImageData
  }
}));
