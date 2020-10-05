if (window.location.search.match( /print-pdf/gi )) {
    var theme = document.createElement( "link" );
    theme.rel = "stylesheet";
    theme.type = "text/css";
    theme.href =  "dist/theme/white.css";
    document.getElementsByTagName( "head" )[0].appendChild( theme );
    var pdfcss = document.createElement( "link" );
    pdfcss.rel = "stylesheet";
    pdfcss.type = "text/css";
    pdfcss.href = "print-pdf.css";
    document.getElementsByTagName("head")[0].appendChild( pdfcss );
}

window.onload = function(){
    if (window.location.search.match( /print-pdf/gi )) {
        document.getElementById("homebutton").remove();
        print();
    }
 };
