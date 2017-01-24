// FILTERS
var filters = {
  // BOX BLUR
  blur: [ [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1] ]
    .map( function( a ) {
      return a.map( function( d ) {
        return d / 25  }) }),
  // EDGE DETECT
  edgeDetect: [ [ -1, -1, -1 ], [ -1, 8, -1 ], [ -1, -1, -1 ] ],
  // EMBOSS
  emboss: [ [ -2, -1, 0 ], [ -1, 1, 1 ], [ 0, 1, 2 ] ],
  // GAUSSIAN BLUR
  gaussian: [ [ 1, 4, 6, 4, 1 ], [ 4, 16, 24, 16, 4 ], [ 6, 24, 36, 24, 6], [ 4, 16, 24, 16, 4 ], [ 1, 4, 6, 4, 1 ] ]
    .map( function( a ) {
      return a.map( function( d ) {
        return d / 256  }) }),
  // IDENTITY
  identity: [ [ 1 ] ],
  // SHARPEN
  sharpen: [ [ 0, -1, 0 ], [ -1, 5, -1 ], [ 0, -1, 0 ] ],
  // UNSHARP MASK
  unsharp: [ [ 1, 4, 6, 4, 1 ], [ 4, 16, 24, 16, 4 ], [ 6, 24, -476, 24, 6], [ 4, 16, 24, 16, 4 ], [ 1, 4, 6, 4, 1 ] ]
    .map( function( a ) {
      return a.map( function( d ) {
        return -1 * d / 256  }) })
}

function drawImage( filter, cb )
{
  canvas.width = img.width
  canvas.height = img.height
  context.drawImage( img, 0, 0 )

  var imageData = context.getImageData( 0, 0, img.width, img.height )

  setTimeout( function() {
    var start = new Date
    imageData = applyFilter( imageData, filter )
    console.log("FILTER TIME", ((new Date) - start ) / 1000 + "s" )
    context.putImageData( imageData, 0, 0 )
    cb()
  })
}

function setFilter( filter )
{
  byId( "filters").setAttribute( "disabled", "1" )
  byId( "apply").setAttribute( "disabled", "1" )

  drawImage( filter, function() {
    byId( "filters").removeAttribute( "disabled" )
    byId( "apply").removeAttribute( "disabled" )
  })
}

function setPresetFilter( filterName )
{
  var filter = filters[ filterName ]
  setFilter( filter )

  var i0 = ( 5 - filter.length ) / 2

  for ( var i = 0; i < 5; i++ )
    for ( var j = 0; j < 5; j++ ) {
      var v = 0
      if ( filter[ i - i0 ] && filter[ i - i0 ][ j - i0 ] )
        v = filter[ i - i0 ][ j - i0 ]
      byId( "a" + i + j ).value = v
    }
}

function setCustomFilter()
{
  var filter = []

  for ( var i = 0; i < 5; i++ )
    for ( var j = 0; j < 5; j++ ) {
      filter[i] = filter[i] || []
      filter[i][j] = +byId( "a" + i + j ).value
    }

  setFilter( filter )
}

function reset()
{
  setPresetFilter( byId( "filters").value )
}

var byId = function( id ) { return document.getElementById( id ) }
var canvas = byId("canvas")
var context = canvas.getContext("2d")

var img = document.createElement("img")
img.onload = function() { setPresetFilter( "identity" ) }
img.src = "library.jpg"
