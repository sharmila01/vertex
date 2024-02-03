const express = require('express');
const path =require('path');
const app = express();
var request = require('request');
// var baseUrl = 'http://185.32.221.116:3000/'
var baseUrl = 'https://portaladmin.vertex.market/'
app.use(express.static(path.join(__dirname,'dist')));


//prerender
const prerenderApp = express();

console.log(__dirname);

app.route('/robots.txt')
.get((req, res) => {
    res.sendFile(path.resolve('robots.txt'));
});
app.route('/sitemap.xml')
.get((req, res) => {
    Promise.all()
    request(`${baseUrl}all-projects`, function(error, response, body) {
        var urls = ['home', 'vertex/login', 'vertex/signup', 'about-us', 'terms', 'privacy-policy', 'faq', 'how-works', 'white-paper', 'forgot-password', 'token-sale/all', 'token-sale/ongoing', 'token-sale/upcoming', 'transaction-history', 'profile', 'change-password', 'notification-details', 'contact-us'];
        function generate_xml_sitemap() {
            // console.log(urls)
            // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
            
            // the root of your website - the protocol and the domain name with a trailing slash
            var root_path = 'https://vertex.market/';
            // XML sitemap generation starts here
            var priority = 0.80;
            var freq = 'weekly';
            var newDate = new Date();
            var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
            for (var i in urls) {
                xml += '<url>';
                xml += '<loc>'+ root_path + urls[i] + '</loc>';
                xml += '<lastmod>' + newDate.toISOString() + '</lastmod>';
                xml += '<changefreq>'+ freq +'</changefreq>';
                xml += '<priority>'+ priority +'</priority>';
                xml += '</url>';
                i++;
            }
            xml += '</urlset>';
            return xml;
        }
        if(response && response.statusCode == 200) {
            try {
                let body1 = JSON.parse(body)
                // console.log('body ==>> ',typeof body1, body1.project_ticker)
                let str = []
                for(let i in body1.project_ticker) {
                    str = `token-information/${encodeURIComponent(i)}-${encodeURIComponent(body1.project_ticker[i])}`
                    urls.push(str)
                }
                request(`${baseUrl}get-webpages`, function(error, response, body) {
                    // request('https://portaladmin.vertex.market/get-webpages', function(error, response, body) {
                    if(response && response.statusCode == 200) {
                        try {
                            let body1 = JSON.parse(body)
                            if(body1.data.length) {
                                for(let i = 0; i<body1.data.length; i++) {
                                    urls.push(`digital-assets/${body1.data[i].page_url}`);
                                }
                            }
                        } catch(error){

                        }
                    }
                    var sitemap = generate_xml_sitemap(); // get the dynamically generated XML sitemap
                    res.header('Content-Type', 'text/xml');
                    res.send(sitemap);
                })
            } catch(err) {
                // console.log('parse err =>> ', err)
                
            }
            
        }
        
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        
    });   
    // res.sendFile(path.resolve('sitemap.xml'));
});

//prerender token
app.use(require('prerender-node').set('prerenderToken', 'rEP8LJfvaQyo8NVGpBoU'));

app.get('/*',(req,res)=>{
    console.log('seo & sitemap req')
res.sendFile(__dirname +"/dist/index.html");
})

let port = process.env.NODE_ENV || 1402;
app.listen(port,()=>console.log(`sitemap server & prerender seo are running on port ${port}`));




