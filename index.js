
const express = require('express');
const app = express();
const axios = require('axios');

const tokenUrl = 'http://20.244.56.144/test/auth';
const authData = {
  companyName: 'Afford',
  clientID: '5dd18f86-e4d6-4cf4-ab2b-9ccc4672e80e',
  clientSecret: 'OoryqsBsXNFhytSe',
  ownerName: 'Rahul',
  ownerEmail: 'rahul.s2020c@vitstudent.ac.in',
  rollNo: '20MIC0117'
};

async function getAccessToken() {
  try {
    const response = await axios.post(tokenUrl, authData, {
      headers: { 'Content-Type': 'application/json' } // Specify JSON content type
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Re-throw the error for proper handling
  }
}

// (Example usage)
getAccessToken()
  .then(accessToken => {
    return accessToken;
    // Now you can use the access token in subsequent API calls
  })
  .catch(error => {
    console.error('Failed to get access token:', error);
  });
   

async function fetchDataWithToken(company,n,product) {
    const accessToken = await getAccessToken();
  
    const headers = { Authorization: `Bearer ${accessToken}` };
    const apiUrl = `http://20.244.56.144/test/companies/${company}/categories/${product}/products?top=${n}&minPrice=1&maxPrice=10000`

    try {
      const response = await axios.get(apiUrl, { headers });
      //console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}
const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
var Finaldata = {}
async function compareProducts(n,productname) {
    for (var i =0;i<5;i++) {
        
   
        const data = await fetchDataWithToken(companies[i],n,productname);
        Finaldata = {...Finaldata, [companies[i]]: data};
        console.log(data);
      console.log("**********************************************************");
     }
     console.log(Finaldata);
     console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    return Finaldata;
}
  



  

app.use(express.json());

const port = 3500;
app.listen(port,function(){
    console.log(`Listening on port: ${port}`);
})

app.get('/categories/:categoryname/products/:n',function(req,res){
    const categoryname = req.params.categoryname;
    const n = req.params.n;
    var result = compareProducts(n,categoryname);
    console.log("*************************************************************");
    console.log(result);
    res.send(result);
})