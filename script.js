var template =`
<!DOCTYPE>
<html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <script>
            alert("hello");
        </script>
    </body>
</html>`;

var blob = new Blob([template], { type: "text/html" });
var blob_url = URL.createObjectURL(blob);
var blob_a = document.querySelector('#blob-test');
blob_a.href = blob_url;
