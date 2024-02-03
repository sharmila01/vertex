import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment';
import { Cacheable } from 'ngx-cacheable';
// import { ProdUrl as GlobalConstant } from '../global/global.constant';
import { DevUrl as GlobalConstant } from '../global/global.constant';
// import { TestUrl as GlobalConstant } from '../global/global.constant';


@Injectable()

export class MainService {
	mainTokenName = 'VTEXP'
	signInBS =  new BehaviorSubject(`loggedout`);
	signInObs = this.signInBS.asObservable();
	tabBS = new BehaviorSubject(``)
	tabObs = this.tabBS.asObservable();
	loginVar = ``
	insProfile: any = {};
	buyTokenAlready: any ={};
	// baseUrl: any = `http://172.16.6.82:8000/`;
	  //  baseUrl: any = `http://172.16.1.32:8000/`;
	  // baseUrl: any = `http://172.16.6.82:8000/`;
	 baseUrl: any = `http://185.32.221.116:3000/`;
	//  baseUrl: any = `https://182.64.21.193:3001/`;
	//  baseUrl: any = `103.201.141.98:3001`;
	//  baseUrl: any = `http://185.32.221.116:3000/`;
	// baseUrl: any = `http://172.16.6.223:8000/`; //piyoosh
	//  baseUrl: any = `https://portaladmin.vertex.market/`;
	// baseUrl: any = `https://127.0.0.1:8000/`;
	// baseUrl: any = `http://52.74.218.145:4003/`;
	// baseUrl = "http://35add23c.ngrok.io/why-vertex"

	//  baseUrl: any = `https://127.0.0.1:8000/`;
	currToken: any = ``;
	//baseUrl: any = `http://ec2-52-74-218-145.ap-southeast-1.compute.amazonaws.com:4003/`;
	websocket: any;
	interval: any;
	kycInterval: any;
	constructor(private toastr: ToastrService, private http: HttpClient, private spinner: NgxSpinnerService) {
		this.baseUrl = GlobalConstant.baseUrl;
		
		// this.websocketConnect()
		// this.onEventWebsocket().subscribe(response => {
		// 	console.log(response)
		// }, error => {
		// 	console.log(error)
		// })
			/* this.allCountryList = this.allCountryList.filter((thing, index, self) =>
				index === self.findIndex((t) => (
					t.code === thing.code 
				))
			)
			this.allCountryList = this.allCountryList.sort((a, b) =>  {
				return a.code - b.code;
			}); */
	}
	websocketConnect() {
		this.websocket = new WebSocket(`ws://172.16.1.32:8000/users/`)
		console.log(this.websocket)
	}
	websocketDisconnect() {
		this.websocket.close()
		// this.websocket.ondisconnect(() => console.log('disconnnect'))
	}
	onEventWebsocket() {
		return Observable.create(observer => {
	    	this.websocket.onmessage = (msg) => {
	        	observer.next(msg)
	      	}  
	    })
	}
	emitWebsocket(msg) {
		this.websocket.send(msg)
	}
	@Cacheable({
    maxAge: 7500
  })
  getPlatformCurrency(): Observable<any> {
		var httpOptions;
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				observe: 'response'
			}
			return this.http.get((this.baseUrl + 'get-currency'), httpOptions)

	}

  getTokens(data): Observable<any> {
		var httpOptions;
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				observe: 'response'
			}
			return this.http.post((this.baseUrl+'want-to-buys'), data,httpOptions)

	}




	getApi(url, isHeader): Observable<any>  {
		var httpOptions;
		if(isHeader === 0) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				observe: 'response'
			}
			return this.http.get((this.baseUrl+url), httpOptions)
		} else if(isHeader === 1) {
			httpOptions = {
				
				headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${JSON.parse(localStorage.getItem(`loginToken`)).token}` }),
				observe: 'response'
			
			}
			return this.http.get((this.baseUrl+url), httpOptions)
				
		}
		console.log(httpOptions)
	}



	postApi(url, data, isHeader): Observable<any> {
		var httpOptions;
		if(isHeader === 0) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				observe: 'response'
			}
			return this.http.post((this.baseUrl+url), data, httpOptions)

		} else if(isHeader === 1) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${JSON.parse(localStorage.getItem(`loginToken`)).token}` }),
				observe: 'response'
			}
			return this.http.post((this.baseUrl+url), data, httpOptions)
		} else if(isHeader === 2) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${this.currToken}` }),
				observe: 'response'
			}
			return this.http.post((this.baseUrl+url), data, httpOptions)
		}

	}

	// uploadApi(url, data, isHeader): Observable<any> {
	// 	var httpOptions;
	// 	if(isHeader === 0) {
	// 		httpOptions = {
	// 			headers: new HttpHeaders({ "Content-Type": "application/json" }),
	// 			observe: 'response'
	// 		}
	// 		return this.http.post(('103.201.141.98:3001/'+url), data, httpOptions)

	// 	} else if(isHeader === 1) {
	// 		httpOptions = {
	// 			headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${JSON.parse(localStorage.getItem(`loginToken`)).token}` }),
	// 			observe: 'response'
	// 		}
	// 		return this.http.post(('103.201.141.98:3001/'+url), data, httpOptions)
	// 	} else if(isHeader === 2) {
	// 		httpOptions = {
	// 			headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${this.currToken}` }),
	// 			observe: 'response'
	// 		}
	// 		return this.http.post(('103.201.141.98:3001/'+url), data, httpOptions)
	// 	}

	// }


	putApi(url, data, isHeader): Observable<any> {
		var httpOptions;
		if(isHeader === 0) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json" }),
				observe: 'response'
			}
			return this.http.put((this.baseUrl+url), data, httpOptions)

		} else if(isHeader === 1) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${JSON.parse(localStorage.getItem(`loginToken`)).token}` }),
				observe: 'response'
			}
			return this.http.put((this.baseUrl+url), data, httpOptions)
		} else if(isHeader === 2) {
			httpOptions = {
				headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": `JWT ${this.currToken}` }),
				observe: 'response'
			}
			return this.http.put((this.baseUrl+url), data, httpOptions)
		}

	}

	kycApi(): Observable<any> {
		let httpOptions = {
			headers: new HttpHeaders({ "x-api-key": "Pv0ltZQibL2glGE7oFYJ5Hb8sNnB8jw6AXJIXbXi" })
		}
		return this.http.get('https://pluginst.identitymind.com/sandbox/auth', httpOptions)
	}
	
	public getNewsfeed(): Observable<any> {
		
		let params = new HttpParams();
		params = params.append('auth_token', "cb270510acdb861ae260d6f5b9f4916b4742c934");
		params = params.append('currencies', "POLY");
		
		return this.http.get(environment.endPoints.getNews, { params: params })
		
	}
	toastrSucc(msg) {
		this.toastr.success(msg);
	}
	toastrErr(msg) {
		this.toastr.error(msg);
	}
	spinnerShow() {
		this.spinner.show();
	}
	spinnerHide() {
		this.spinner.hide();
	}

	getCountriesJson(): Observable<any> {
		return this.http.get(`assets/json/countries.json`)
	}

	changeSigninBs(val) {
		this.signInBS.next(val)
	}
	changeTabBs(val) {
		this.tabBS.next(val)
	}
	printFun(id): void {
		// console.log(id)
		let printContents, popupWin;
		printContents = document.getElementById(id).innerHTML;
		popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
			<html>
				<head>
					<title>Print tab</title>
					<style>
					//........Customized style.......
					 
			
					</style>
					<link href="../../assets/institutional/css/style1.css" rel="stylesheet">
					 <link href="../../assets/css/style.css" rel="stylesheet">
					//  <link href="./stylee.css" rel="stylesheet">
				</head>
		<body onload="window.print();window.close()">${printContents}</body>
			</html>`
		);
		popupWin.document.close();
	}

	openAddressPage(txId, symbol='') {
		// window.open(`https://ropsten.etherscan.io/address/${txId}`)
		if(symbol == 'BTC') window.open(`${GlobalConstant.btcAddress}${txId}/`)
		else window.open(`${GlobalConstant.ethAddress}${txId}`)
	}
	openEtherPage(txId, symbol) {
		// window.open(`https://ropsten.etherscan.io/tx/${txId}`)
		if(symbol == 'BTC') window.open(`${GlobalConstant.btcTxn}${txId}/`)
		else	window.open(`${GlobalConstant.ethTxn}${txId}`)
	}
	copyToClipboard(text) {
		/* document.addEventListener('copy', (e: ClipboardEvent) => {
			console.log('scopy clipboard')
			e.clipboardData.setData('text/plain', (text));
			document.removeEventListener('copy', null);
      e.preventDefault();
      
		}); */
		document.addEventListener('copy', clickEvent)
		function clickEvent(e: ClipboardEvent) {
			// console.log('copy')
			e.clipboardData.setData('text/plain', (text));
			e.preventDefault();
			document.removeEventListener('copy', clickEvent)
		}
    document.execCommand('copy');
	}
	countryList: any =  [
		{"name": "Afghanistan", "code": "AF"},
		{"name": "Åland Islands", "code": "AX"},
		{"name": "Albania", "code": "AL"},
		{"name": "Algeria", "code": "DZ"},
		{"name": "American Samoa", "code": "AS"},
		{"name": "AndorrA", "code": "AD"},
		{"name": "Angola", "code": "AO"},
		{"name": "Anguilla", "code": "AI"},
		{"name": "Antarctica", "code": "AQ"},
		{"name": "Antigua and Barbuda", "code": "AG"},
		{"name": "Argentina", "code": "AR"},
		{"name": "Armenia", "code": "AM"},
		{"name": "Aruba", "code": "AW"},
		{"name": "Australia", "code": "AU"},
		{"name": "Austria", "code": "AT"},
		{"name": "Azerbaijan", "code": "AZ"},
		{"name": "Bahamas", "code": "BS"},
		{"name": "Bahrain", "code": "BH"},
		{"name": "Bangladesh", "code": "BD"},
		{"name": "Barbados", "code": "BB"},
		{"name": "Belarus", "code": "BY"},
		{"name": "Belgium", "code": "BE"},
		{"name": "Belize", "code": "BZ"},
		{"name": "Benin", "code": "BJ"},
		{"name": "Bermuda", "code": "BM"},
		{"name": "Bhutan", "code": "BT"},
		{"name": "Bolivia", "code": "BO"},
		{"name": "Bosnia and Herzegovina", "code": "BA"},
		{"name": "Botswana", "code": "BW"},
		{"name": "Bouvet Island", "code": "BV"},
		{"name": "Brazil", "code": "BR"},
		{"name": "British Indian Ocean Territory", "code": "IO"},
		{"name": "Brunei Darussalam", "code": "BN"},
		{"name": "Bulgaria", "code": "BG"},
		{"name": "Burkina Faso", "code": "BF"},
		{"name": "Burundi", "code": "BI"},
		{"name": "Cambodia", "code": "KH"},
		{"name": "Cameroon", "code": "CM"},
		{"name": "Canada", "code": "CA"},
		{"name": "Cape Verde", "code": "CV"},
		{"name": "Cayman Islands", "code": "KY"},
		{"name": "Central African Republic", "code": "CF"},
		{"name": "Chad", "code": "TD"},
		{"name": "Chile", "code": "CL"},
		{"name": "China", "code": "CN"},
		{"name": "Christmas Island", "code": "CX"},
		{"name": "Cocos (Keeling) Islands", "code": "CC"},
		{"name": "Colombia", "code": "CO"},
		{"name": "Comoros", "code": "KM"},
		{"name": "Congo", "code": "CG"},
		{"name": "Congo, The Democratic Republic of the", "code": "CD"},
		{"name": "Cook Islands", "code": "CK"},
		{"name": "Costa Rica", "code": "CR"},
		{"name": "Cote D'Ivoire", "code": "CI"},
		{"name": "Croatia", "code": "HR"},
		{"name": "Cuba", "code": "CU"},
		{"name": "Cyprus", "code": "CY"},
		{"name": "Czech Republic", "code": "CZ"},
		{"name": "Denmark", "code": "DK"},
		{"name": "Djibouti", "code": "DJ"},
		{"name": "Dominica", "code": "DM"},
		{"name": "Dominican Republic", "code": "DO"},
		{"name": "Ecuador", "code": "EC"},
		{"name": "Egypt", "code": "EG"},
		{"name": "El Salvador", "code": "SV"},
		{"name": "Equatorial Guinea", "code": "GQ"},
		{"name": "Eritrea", "code": "ER"},
		{"name": "Estonia", "code": "EE"},
		{"name": "Ethiopia", "code": "ET"},
		{"name": "Falkland Islands (Malvinas)", "code": "FK"},
		{"name": "Faroe Islands", "code": "FO"},
		{"name": "Fiji", "code": "FJ"},
		{"name": "Finland", "code": "FI"},
		{"name": "France", "code": "FR"},
		{"name": "French Guiana", "code": "GF"},
		{"name": "French Polynesia", "code": "PF"},
		{"name": "French Southern Territories", "code": "TF"},
		{"name": "Gabon", "code": "GA"},
		{"name": "Gambia", "code": "GM"},
		{"name": "Georgia", "code": "GE"},
		{"name": "Germany", "code": "DE"},
		{"name": "Ghana", "code": "GH"},
		{"name": "Gibraltar", "code": "GI"},
		{"name": "Greece", "code": "GR"},
		{"name": "Greenland", "code": "GL"},
		{"name": "Grenada", "code": "GD"},
		{"name": "Guadeloupe", "code": "GP"},
		{"name": "Guam", "code": "GU"},
		{"name": "Guatemala", "code": "GT"},
		{"name": "Guernsey", "code": "GG"},
		{"name": "Guinea", "code": "GN"},
		{"name": "Guinea-Bissau", "code": "GW"},
		{"name": "Guyana", "code": "GY"},
		{"name": "Haiti", "code": "HT"},
		{"name": "Heard Island and Mcdonald Islands", "code": "HM"},
		{"name": "Holy See (Vatican City State)", "code": "VA"},
		{"name": "Honduras", "code": "HN"},
		{"name": "Hong Kong", "code": "HK"},
		{"name": "Hungary", "code": "HU"},
		{"name": "Iceland", "code": "IS"},
		{"name": "India", "code": "IN"},
		{"name": "Indonesia", "code": "ID"},
		{"name": "Iran, Islamic Republic Of", "code": "IR"},
		{"name": "Iraq", "code": "IQ"},
		{"name": "Ireland", "code": "IE"},
		{"name": "Isle of Man", "code": "IM"},
		{"name": "Israel", "code": "IL"},
		{"name": "Italy", "code": "IT"},
		{"name": "Jamaica", "code": "JM"},
		{"name": "Japan", "code": "JP"},
		{"name": "Jersey", "code": "JE"},
		{"name": "Jordan", "code": "JO"},
		{"name": "Kazakhstan", "code": "KZ"},
		{"name": "Kenya", "code": "KE"},
		{"name": "Kiribati", "code": "KI"},
		{"name": "Korea, Democratic People'S Republic of", "code": "KP"},
		{"name": "Korea, Republic of", "code": "KR"},
		{"name": "Kuwait", "code": "KW"},
		{"name": "Kyrgyzstan", "code": "KG"},
		{"name": "Lao People'S Democratic Republic", "code": "LA"},
		{"name": "Latvia", "code": "LV"},
		{"name": "Lebanon", "code": "LB"},
		{"name": "Lesotho", "code": "LS"},
		{"name": "Liberia", "code": "LR"},
		{"name": "Libyan Arab Jamahiriya", "code": "LY"},
		{"name": "Liechtenstein", "code": "LI"},
		{"name": "Lithuania", "code": "LT"},
		{"name": "Luxembourg", "code": "LU"},
		{"name": "Macao", "code": "MO"},
		{"name": "Macedonia, The Former Yugoslav Republic of", "code": "MK"},
		{"name": "Madagascar", "code": "MG"},
		{"name": "Malawi", "code": "MW"},
		{"name": "Malaysia", "code": "MY"},
		{"name": "Maldives", "code": "MV"},
		{"name": "Mali", "code": "ML"},
		{"name": "Malta", "code": "MT"},
		{"name": "Marshall Islands", "code": "MH"},
		{"name": "Martinique", "code": "MQ"},
		{"name": "Mauritania", "code": "MR"},
		{"name": "Mauritius", "code": "MU"},
		{"name": "Mayotte", "code": "YT"},
		{"name": "Mexico", "code": "MX"},
		{"name": "Micronesia, Federated States of", "code": "FM"},
		{"name": "Moldova, Republic of", "code": "MD"},
		{"name": "Monaco", "code": "MC"},
		{"name": "Mongolia", "code": "MN"},
		{"name": "Montserrat", "code": "MS"},
		{"name": "Morocco", "code": "MA"},
		{"name": "Mozambique", "code": "MZ"},
		{"name": "Myanmar", "code": "MM"},
		{"name": "Namibia", "code": "NA"},
		{"name": "Nauru", "code": "NR"},
		{"name": "Nepal", "code": "NP"},
		{"name": "Netherlands", "code": "NL"},
		{"name": "Netherlands Antilles", "code": "AN"},
		{"name": "New Caledonia", "code": "NC"},
		{"name": "New Zealand", "code": "NZ"},
		{"name": "Nicaragua", "code": "NI"},
		{"name": "Niger", "code": "NE"},
		{"name": "Nigeria", "code": "NG"},
		{"name": "Niue", "code": "NU"},
		{"name": "Norfolk Island", "code": "NF"},
		{"name": "Northern Mariana Islands", "code": "MP"},
		{"name": "Norway", "code": "NO"},
		{"name": "Oman", "code": "OM"},
		{"name": "Pakistan", "code": "PK"},
		{"name": "Palau", "code": "PW"},
		{"name": "Palestinian Territory, Occupied", "code": "PS"},
		{"name": "Panama", "code": "PA"},
		{"name": "Papua New Guinea", "code": "PG"},
		{"name": "Paraguay", "code": "PY"},
		{"name": "Peru", "code": "PE"},
		{"name": "Philippines", "code": "PH"},
		{"name": "Pitcairn", "code": "PN"},
		{"name": "Poland", "code": "PL"},
		{"name": "Portugal", "code": "PT"},
		{"name": "Puerto Rico", "code": "PR"},
		{"name": "Qatar", "code": "QA"},
		{"name": "Reunion", "code": "RE"},
		{"name": "Romania", "code": "RO"},
		{"name": "Russian Federation", "code": "RU"},
		{"name": "RWANDA", "code": "RW"},
		{"name": "Saint Helena", "code": "SH"},
		{"name": "Saint Kitts and Nevis", "code": "KN"},
		{"name": "Saint Lucia", "code": "LC"},
		{"name": "Saint Pierre and Miquelon", "code": "PM"},
		{"name": "Saint Vincent and the Grenadines", "code": "VC"},
		{"name": "Samoa", "code": "WS"},
		{"name": "San Marino", "code": "SM"},
		{"name": "Sao Tome and Principe", "code": "ST"},
		{"name": "Saudi Arabia", "code": "SA"},
		{"name": "Senegal", "code": "SN"},
		{"name": "Serbia and Montenegro", "code": "CS"},
		{"name": "Seychelles", "code": "SC"},
		{"name": "Sierra Leone", "code": "SL"},
		{"name": "Singapore", "code": "SG"},
		{"name": "Slovakia", "code": "SK"},
		{"name": "Slovenia", "code": "SI"},
		{"name": "Solomon Islands", "code": "SB"},
		{"name": "Somalia", "code": "SO"},
		{"name": "South Africa", "code": "ZA"},
		{"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
		{"name": "Spain", "code": "ES"},
		{"name": "Sri Lanka", "code": "LK"},
		{"name": "Sudan", "code": "SD"},
		{"name": "Suriname", "code": "SR"},
		{"name": "Svalbard and Jan Mayen", "code": "SJ"},
		{"name": "Swaziland", "code": "SZ"},
		{"name": "Sweden", "code": "SE"},
		{"name": "Switzerland", "code": "CH"},
		{"name": "Syrian Arab Republic", "code": "SY"},
		{"name": "Taiwan, Province of China", "code": "TW"},
		{"name": "Tajikistan", "code": "TJ"},
		{"name": "Tanzania, United Republic of", "code": "TZ"},
		{"name": "Thailand", "code": "TH"},
		{"name": "Timor-Leste", "code": "TL"},
		{"name": "Togo", "code": "TG"},
		{"name": "Tokelau", "code": "TK"},
		{"name": "Tonga", "code": "TO"},
		{"name": "Trinidad and Tobago", "code": "TT"},
		{"name": "Tunisia", "code": "TN"},
		{"name": "Turkey", "code": "TR"},
		{"name": "Turkmenistan", "code": "TM"},
		{"name": "Turks and Caicos Islands", "code": "TC"},
		{"name": "Tuvalu", "code": "TV"},
		{"name": "Uganda", "code": "UG"},
		{"name": "Ukraine", "code": "UA"},
		{"name": "United Arab Emirates", "code": "AE"},
		{"name": "United Kingdom", "code": "GB"},
		{"name": "United States", "code": "US"},
		{"name": "United States Minor Outlying Islands", "code": "UM"},
		{"name": "Uruguay", "code": "UY"},
		{"name": "Uzbekistan", "code": "UZ"},
		{"name": "Vanuatu", "code": "VU"},
		{"name": "Venezuela", "code": "VE"},
		{"name": "Viet Nam", "code": "VN"},
		{"name": "Virgin Islands, British", "code": "VG"},
		{"name": "Virgin Islands, U.S.", "code": "VI"},
		{"name": "Wallis and Futuna", "code": "WF"},
		{"name": "Western Sahara", "code": "EH"},
		{"name": "Yemen", "code": "YE"},
		{"name": "Zambia", "code": "ZM"},
		{"name": "Zimbabwe", "code": "ZW"}
		]
		allCountryList: any = [{"code":"+1"},{"code":"+20"},{"code":"+211"},{"code":"+212"},{"code":"+213"},{"code":"+216"},{"code":"+218"},{"code":"+220"},{"code":"+221"},{"code":"+222"},{"code":"+223"},{"code":"+224"},{"code":"+225"},{"code":"+226"},{"code":"+227"},{"code":"+228"},{"code":"+229"},{"code":"+230"},{"code":"+231"},{"code":"+232"},{"code":"+233"},{"code":"+234"},{"code":"+235"},{"code":"+236"},{"code":"+237"},{"code":"+238"},{"code":"+239"},{"code":"+240"},{"code":"+241"},{"code":"+242"},{"code":"+243"},{"code":"+244"},{"code":"+245"},{"code":"+246"},{"code":"+248"},{"code":"+249"},{"code":"+250"},{"code":"+251"},{"code":"+252"},{"code":"+253"},{"code":"+254"},{"code":"+255"},{"code":"+256"},{"code":"+257"},{"code":"+258"},{"code":"+260"},{"code":"+261"},{"code":"+262"},{"code":"+263"},{"code":"+264"},{"code":"+265"},{"code":"+266"},{"code":"+267"},{"code":"+268"},{"code":"+269"},{"code":"+27"},{"code":"+290"},{"code":"+291"},{"code":"+297"},{"code":"+298"},{"code":"+299"},{"code":"+30"},{"code":"+31"},{"code":"+32"},{"code":"+33"},{"code":"+34"},{"code":"+350"},{"code":"+351"},{"code":"+352"},{"code":"+353"},{"code":"+354"},{"code":"+355"},{"code":"+356"},{"code":"+357"},{"code":"+358"},{"code":"+359"},{"code":"+36"},{"code":"+370"},{"code":"+371"},{"code":"+372"},{"code":"+373"},{"code":"+374"},{"code":"+375"},{"code":"+376"},{"code":"+377"},{"code":"+378"},{"code":"+379"},{"code":"+380"},{"code":"+381"},{"code":"+382"},{"code":"+385"},{"code":"+386"},{"code":"+387"},{"code":"+389"},{"code":"+39"},{"code":"+40"},{"code":"+41"},{"code":"+420"},{"code":"+421"},{"code":"+423"},{"code":"+43"},{"code":"+44"},{"code":"+45"},{"code":"+46"},{"code":"+47"},{"code":"+48"},{"code":"+49"},{"code":"+500"},{"code":"+501"},{"code":"+502"},{"code":"+503"},{"code":"+504"},{"code":"+505"},{"code":"+506"},{"code":"+507"},{"code":"+508"},{"code":"+509"},{"code":"+51"},{"code":"+52"},{"code":"+53"},{"code":"+54"},{"code":"+55"},{"code":"+56"},{"code":"+57"},{"code":"+58"},{"code":"+590"},{"code":"+591"},{"code":"+592"},{"code":"+593"},{"code":"+594"},{"code":"+595"},{"code":"+596"},{"code":"+597"},{"code":"+598"},{"code":"+599"},{"code":"+60"},{"code":"+61"},{"code":"+62"},{"code":"+63"},{"code":"+64"},{"code":"+65"},{"code":"+66"},{"code":"+670"},{"code":"+672"},{"code":"+673"},{"code":"+674"},{"code":"+675"},{"code":"+676"},{"code":"+677"},{"code":"+678"},{"code":"+679"},{"code":"+680"},{"code":"+681"},{"code":"+682"},{"code":"+683"},{"code":"+685"},{"code":"+686"},{"code":"+687"},{"code":"+688"},{"code":"+689"},{"code":"+690"},{"code":"+691"},{"code":"+692"},{"code":"+7"},{"code":"+81"},{"code":"+82"},{"code":"+84"},{"code":"+850"},{"code":"+852"},{"code":"+853"},{"code":"+855"},{"code":"+856"},{"code":"+86"},{"code":"+870"},{"code":"+880"},{"code":"+886"},{"code":"+90"},{"code":"+91"},{"code":"+92"},{"code":"+93"},{"code":"+94"},{"code":"+95"},{"code":"+960"},{"code":"+961"},{"code":"+962"},{"code":"+963"},{"code":"+964"},{"code":"+965"},{"code":"+966"},{"code":"+967"},{"code":"+968"},{"code":"+970"},{"code":"+971"},{"code":"+972"},{"code":"+973"},{"code":"+974"},{"code":"+975"},{"code":"+976"},{"code":"+977"},{"code":"+98"},{"code":"+992"},{"code":"+993"},{"code":"+994"},{"code":"+995"},{"code":"+996"},{"code":"+998"}]

	allCountryList1: any =
		[
		  {
			"country": "Afghanistan",
			"states": ["Badakhshan", "Badghis", "Baghlan", "Balkh", "Bamian", "Daykondi", "Farah", "Faryab", "Ghazni", "Ghowr", "Helmand", "Herat",               "Jowzjan", "Kabul", "Kandahar", "Kapisa", "Khost", "Konar", "Kondoz", "Laghman", "Lowgar", "Nangarhar", "Nimruz", "Nurestan",               "Oruzgan", "Paktia", "Paktika", "Panjshir", "Parvan", "Samangan", "Sar-e Pol", "Takhar", "Vardak", "Zabol"],
			"code": "+93"
	  },
	  {
		  "country": "Albania",
		  "states": ["Berat", "Dibres", "Durres", "Elbasan", "Fier", "Gjirokastre", "Korce", "Kukes", "Lezhe", "Shkoder", "Tirane", "Vlore"],
		  "code": "+355"
	  },
		  {
			"country": "Algeria",
			"states": [ "Adrar", "Ain Defla", "Ain Temouchent", "Alger", "Annaba", "Batna", "Bechar", "Bejaia", "Biskra", "Blida", "Bordj Bou Arreridj", "Bouira", "Boumerdes", "Chlef", "Constantine", "Djelfa", "El Bayadh", "El Oued", "El Tarf", "Ghardaia", "Guelma", "Illizi", "Jijel", "Khenchela", "Laghouat", "Muaskar", "Medea", "Mila", "Mostaganem", "M'Sila", "Naama", "Oran", "Ouargla", "Oum el Bouaghi", "Relizane", "Saida", "Setif", "Sidi Bel Abbes", "Skikda", "Souk Ahras", "Tamanghasset", "Tebessa", "Tiaret", "Tindouf", "Tipaza", "Tissemsilt", "Tizi Ouzou", "Tlemcen" ],
			"code": "+213"
		  },
		  {
			"country": "Andorra",
			"states": [ "Andorra la Vella", "Canillo", "Encamp", "Escaldes-Engordany", "La Massana", "Ordino", "Sant Julia de Loria" ],
			"code": "+376"
		  },
		  {
			"country": "Angola",
			"states": [ "Bengo", "Benguela", "Bie", "Cabinda", "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huila", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uige", "Zaire" ],
			"code": "+244"
		  },
		  {
			"country": "Anguilla",
			"states": [ "Big Spring Cave", "East End Pond" ],
			"code": "+1264"
		  },
		  {
			"country": "Antigua & Barbuda",
			"states": [ "St. John's" ],
			"code": "+1268"
		  },
		  {
			"country": "Argentina",
			"states": [ "Buenos Aires", "Buenos Aires Capital", "Catamarca", "Chaco", "Chubut", "Cordoba", "Corrientes", "Entre Rios", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquen", "Rio Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucuman" ],
			"code": "+54"
		  },
		  {
			"country": "Armenia",
			"states": [ "Aragatsotn", "Ararat", "Armavir", "Geghark'unik'", "Kotayk'", "Lorri", "Shirak", "Syunik'", "Tavush", "Vayots' Dzor", "Yerevan" ],
			"code": "+374"
		  },
		  {
			"country": "Aruba",
			"states": [
			  "Oranjestad"
			],
			"code": "+297"
		  },
		  {
			"country": "Australia",
			"states": [ "New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria" ],
			"code": "+61"
		  },
		  {
			"country": "Austria",
			"states": [ "Burgenland", "Kaernten", "Niederoesterreich", "Oberoesterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien" ],
			"code": "+43"
		  },
		  {
			"country": "Azerbaijan",
			"states": [ "Abseron Rayonu", "Agcabadi Rayonu", "Agdam Rayonu", "Agdas Rayonu", "Agstafa Rayonu", "Agsu Rayonu", "Astara Rayonu", "Balakan Rayonu", "Barda Rayonu", "Beylaqan Rayonu", "Bilasuvar Rayonu", "Cabrayil Rayonu", "Calilabad Rayonu", "Daskasan Rayonu", "Davaci Rayonu", "Fuzuli Rayonu", "Gadabay Rayonu", "Goranboy Rayonu", "Goycay Rayonu", "Haciqabul Rayonu", "Imisli Rayonu", "Ismayilli Rayonu", "Kalbacar Rayonu", "Kurdamir Rayonu", "Lacin Rayonu", "Lankaran Rayonu", "Lerik Rayonu", "Masalli Rayonu", "Neftcala Rayonu", "Oguz Rayonu", "Qabala Rayonu", "Qax Rayonu", "Qazax Rayonu", "Qobustan Rayonu", "Quba Rayonu", "Qubadli Rayonu", "Qusar Rayonu", "Saatli Rayonu", "Sabirabad Rayonu", "Saki Rayonu", "Salyan Rayonu", "Samaxi Rayonu", "Samkir Rayonu", "Samux Rayonu", "Siyazan Rayonu", "Susa Rayonu", "Tartar Rayonu", "Tovuz Rayonu", "Ucar Rayonu", "Xacmaz Rayonu", "Xanlar Rayonu", "Xizi Rayonu", "Xocali Rayonu", "Xocavand Rayonu", "Yardimli Rayonu", "Yevlax Rayonu", "Zangilan Rayonu", "Zaqatala Rayonu", "Zardab Rayonu", "Ali Bayramli Sahari", "Baki Sahari", "Ganca Sahari", "Lankaran Sahari", "Mingacevir Sahari", "Naftalan Sahari", "Saki Sahari", "Sumqayit Sahari", "Susa Sahari", "Xankandi Sahari", "Yevlax Sahari", "Naxcivan Muxtar" ],
			"code": "+994"
		  },
		  {
			"country": "Bahamas",
			"states": [ "Acklins and Crooked Islands", "Bimini", "Cat Island", "Exuma", "Freeport", "Fresh Creek", "Governor's Harbour", "Green Turtle Cay", "Harbour Island", "High Rock", "Inagua", "Kemps Bay", "Long Island", "Marsh Harbour", "Mayaguana", "New Providence", "Nichollstown and Berry Islands", "Ragged Island", "Rock Sound", "Sandy Point", "San Salvador and Rum Cay" ],
			"code": "+1242"
		  },
		  {
			"country": "Bahrain",
			"states": [ "Al Hadd", "Al Manamah", "Al Mintaqah al Gharbiyah", "Al Mintaqah al Wusta", "Al Mintaqah ash Shamaliyah", "Al Muharraq", "Ar Rifa' wa al Mintaqah al Janubiyah", "Jidd Hafs", "Madinat Hamad", "Madinat 'Isa", "Juzur Hawar", "Sitrah" ],
			"code": "+973"
		  },
		  {
			"country": "Bangladesh",
			"states": [ "Barisal", "Chittagong", "Dhaka", "Khulna", "Rajshahi", "Sylhet" ],
			"code": "+880"
		  },
		  {
			"country": "Barbados",
			"states": [ "Christ Church", "Saint Andrew", "Saint George", "Saint James", "Saint John", "Saint Joseph", "Saint Lucy", "Saint Michael", "Saint Peter", "Saint Philip", "Saint Thomas" ],
			"code": "+1246"
		  },
		  {
			"country": "Belarus",
			"states": [ "Brest", "Homyel", "Horad Minsk", "Hrodna", "Mahilyow", "Minsk", "Vitsyebsk" ],
			"code": "+375"
		  },
		  {
			"country": "Belgium",
			"states": [ "Antwerpen", "Brabant Wallon", "Brussels", "Flanders", "Hainaut", "Liege", "Limburg", "Luxembourg", "Namur", "Oost-Vlaanderen", "Vlaams-Brabant", "Wallonia", "West-Vlaanderen" ],
			"code": "+32"
		  },
		  {
			"country": "Belize",
			"states": [ "Belize", "Cayo", "Corozal", "Orange Walk", "Stann Creek", "Toledo" ],
			"code": "+501"
		  },
		  {
			"country": "Benin",
			"states": [ "Alibori", "Atakora", "Atlantique", "Borgou", "Collines", "Donga", "Kouffo", "Littoral", "Mono", "Oueme", "Plateau", "Zou" ],
			"code": "+229"
		  },
		  {
			"country": "Bermuda",
			"states": [ "Devonshire", "Hamilton", "Hamilton", "Paget", "Pembroke", "Saint George", "Saint George's", "Sandys", "Smith's", "Southampton", "Warwick" ],
			"code": "+1441"
		  },
		  {
			"country": "Bhutan",
			"states": [ "Bumthang", "Chukha", "Dagana", "Gasa", "Haa", "Lhuntse", "Mongar", "Paro", "Pemagatshel", "Punakha", "Samdrup Jongkhar", "Samtse", "Sarpang", "Thimphu", "Trashigang", "Trashiyangste", "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang" ],
			"code": "+975"
		  },
		  {
			"country": "Bolivia",
			"states": [ "Chuquisaca", "Cochabamba", "Beni", "La Paz", "Oruro", "Pando", "Potosi", "Santa Cruz", "Tarija" ],
			"code": "+591"
		  },
		  {
			"country": "Bosnia Herzegovina",
			"states": [ "Una-Sana [Federation]", "Posavina [Federation]", "Tuzla [Federation]", "Zenica-Doboj [Federation]", "Bosnian Podrinje [Federation]", "Central Bosnia [Federation]", "Herzegovina-Neretva [Federation]", "West Herzegovina [Federation]", "Sarajevo [Federation]", " West Bosnia [Federation]", "Banja Luka [RS]", "Bijeljina [RS]", "Doboj [RS]", "Fo?a [RS]", "Sarajevo-Romanija [RS]", "Trebinje [RS]", "Vlasenica [RS]" ],
			"code": "+387"
		  },
		  {
			"country": "Botswana",
			"states": [ "Central", "Ghanzi", "Kgalagadi", "Kgatleng", "Kweneng", "North East", "North West", "South East", "Southern" ],
			"code": "+261"
		  },
		  {
			"country": "Brazil",
			"states": [ "Acre", "Alagoas", "Amapa", "Amazonas", "Bahia", "Ceara", "Distrito Federal", "Espirito Santo", "Goias", "Maranhao", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Para", "Paraiba", "Parana", "Pernambuco", "Piaui", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondonia", "Roraima", "Santa Catarina", "Sao Paulo", "Sergipe", "Tocantins" ],
			"code": "+55"
		  },
		  {
			"country": "Brunei",
			"states": [ "Belait", "Brunei and Muara", "Temburong", "Tutong" ],
			"code": "+673"
		  },
		  {
			"country": "Bulgaria",
			"states": [ "Blagoevgrad", "Burgas", "Dobrich", "Gabrovo", "Khaskovo", "Kurdzhali", "Kyustendil", "Lovech", "Montana", "Pazardzhik", "Pernik", "Pleven", "Plovdiv", "Razgrad", "Ruse", "Shumen", "Silistra", "Sliven", "Smolyan", "Sofiya", "Sofiya-Grad", "Stara Zagora", "Turgovishte", "Varna", "Veliko Turnovo", "Vidin", "Vratsa", "Yambol" ],
			"code": "+359"
		  },
		  {
			"country": "Burkina Faso",
			"states": [ "Bale", "Bam", "Banwa", "Bazega", "Bougouriba", "Boulgou", "Boulkiemde", "Comoe", "Ganzourgou", "Gnagna", "Gourma", "Houet", "Ioba", "Kadiogo", "Kenedougou", "Komondjari", "Kompienga", "Kossi", "Koulpelogo", "Kouritenga", "Kourweogo", "Leraba", "Loroum", "Mouhoun", "Namentenga", "Nahouri", "Nayala", "Noumbiel", "Oubritenga", "Oudalan", "Passore", "Poni", "Sanguie", "Sanmatenga", "Seno", "Sissili", "Soum", "Sourou", "Tapoa", "Tuy", "Yagha", "Yatenga", "Ziro", "Zondoma", "Zoundweogo" ],
			"code": "+226"
		  },
		  {
			"country": "Burundi",
			"states": [
			  "Bubanza",
			  "Bujumbura Mairie",
			  "Bujumbura Rural",
			  "Bururi",
			  "Cankuzo",
			  "Cibitoke",
			  "Gitega",
			  "Karuzi",
			  "Kayanza",
			  "Kirundo",
			  "Makamba",
			  "Muramvya",
			  "Muyinga",
			  "Mwaro",
			  "Ngozi",
			  "Rutana",
			  "Ruyigi"
			],
			"code": "+257"
		  },
		  {
			"country": "Cambodia",
			"states": [ "Banteay Mean Chey", "Batdambang", "Kampong Cham", "Kampong Chhnang", "Kampong Spoe", "Kampong Thum", "Kampot", "Kandal", "Koh Kong", "Kracheh", "Mondol Kiri", "Otdar Mean Chey", "Pouthisat", "Preah Vihear", "Prey Veng", "Rotanakir", "Siem Reab", "Stoeng Treng", "Svay Rieng", "Takao", "Keb", "Pailin", "Phnom Penh", "Preah Seihanu" ],
			"code": "+855"
		  },
		  {
			"country": "Cameroon",
			"states": [ "Adamaoua", "Centre", "Est", "Extreme-Nord", "Littoral", "Nord", "Nord-Ouest", "Ouest", "Sud", "Sud-Ouest" ],
			"code": "+237"
		  },
		  {
			"country": "Canada",
			"states": [ "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon Territory" ],
			"code": "+1"
		  },
		  {
			"country": "Cape Verde Islands",
			"states": [ "Barlavento", "Santo Antão", "São Vicente", "Santa Luzia", "São Nicolau", "Boa Vista", "Sal" ],
			"code": "+238"
		  },
		  {
			"country": "Central African Republic",
			"states": [ "Bamingui-Bangoran", "Bangui", "Basse-Kotto", "Haute-Kotto", "Haut-Mbomou", "Kemo", "Lobaye", "Mambere-Kadei", "Mbomou", "Nana-Grebizi", "Nana-Mambere", "Ombella-Mpoko", "Ouaka", "Ouham", "Ouham-Pende", "Sangha-Mbaere", "Vakaga" ],
			"code": "+236"
		  },
		  {
			"country": "Chile",
			"states": [ "Aysen", "Antofagasta", "Araucania", "Atacama", "Bio-Bio", "Coquimbo", "O'Higgins", "Los Lagos", "Magallanes y la Antartica Chilena", "Maule", "Santiago Region Metropolitana", "Tarapaca", "Valparaiso" ],
			"code": "+56"
		  },
		  {
			"country": "China",
			"states": [ "Anhui", "Fujian", "Gansu", "Guangdong", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hubei", "Hunan", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Qinghai", "Shaanxi", "Shandong", "Shanxi", "Sichuan", "Yunnan", "Zhejiang", "Guangxi", "Nei Mongol", "Ningxia", "Xinjiang", "Xizang (Tibet)", "Beijing", "Chongqing", "Shanghai", "Tianjin" ],
			"code": "+86"
		  },
		  {
			"country": "Colombia",
			"states": [ "Amazonas", "Antioquia", "Arauca", "Atlantico", "Bogota District Capital", "Bolivar", "Boyaca", "Caldas", "Caqueta", "Casanare", "Cauca", "Cesar", "Choco", "Cordoba", "Cundinamarca", "Guainia", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Narino", "Norte de Santander", "Putumayo", "Quindio", "Risaralda", "San Andres & Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupes", "Vichada" ],
			"code": "+57"
		  },
		  {
			"country": "Comoros",
			"states": [
			  "Grande Comore (Njazidja)",
			  "Anjouan (Nzwani)",
			  "Moheli (Mwali)"
			],
			"code": "+269"
		  },
		  {
			"country": "Congo",
			"states": [ "Bandundu", "Bas-Congo", "Equateur", "Kasai-Occidental", "Kasai-Oriental", "Katanga", "Kinshasa", "Maniema", "Nord-Kivu", "Orientale", "Sud-Kivu" ],
			"code": "+242"
		  },
		  {
			"country": "Costa Rica",
			"states": [ "Alajuela", "Cartago", "Guanacaste", "Heredia", "Limon", "Puntarenas", "San Jose" ],
			"code": "+506"
		  },
		  {
			"country": "Croatia",
			"states": [ "Bjelovarsko-Bilogorska", "Brodsko-Posavska", "Dubrovacko-Neretvanska", "Istarska", "Karlovacka", "Koprivnicko-Krizevacka", "Krapinsko-Zagorska", "Licko-Senjska", "Medimurska", "Osjecko-Baranjska", "Pozesko-Slavonska", "Primorsko-Goranska", "Sibensko-Kninska", "Sisacko-Moslavacka", "Splitsko-Dalmatinska", "Varazdinska", "Viroviticko-Podravska", "Vukovarsko-Srijemska", "Zadarska", "Zagreb", "Zagrebacka" ],
			"code": "+385"
		  },
		  {
			"country": "Cuba",
			"states": [ "Camaguey", "Ciego de Avila", "Cienfuegos", "Ciudad de La Habana", "Granma", "Guantanamo", "Holguin", "Isla de la Juventud", "La Habana", "Las Tunas", "Matanzas", "Pinar del Rio", "Sancti Spiritus", "Santiago de Cuba", "Villa Clara" ],
			"code": "+53"
		  },
		  {
			"country": "Cyprus North",
			"states": [ "Famagusta", "Kyrenia", "Larnaca", "Limassol", "Nicosia", "Paphos" ],
			"code": "+90392"
		  },
		  {
			"country": "Cyprus South",
			"states": [
			  "Famagusta",
			  "Kyrenia",
			  "Larnaca",
			  "Limassol",
			  "Nicosia",
			  "Paphos"
			],
			"code": "+357"
		  },
		  {
			"country": "Czech Republic",
			"states": [
			  "Jihocesky Kraj",
			  "Jihomoravsky Kraj",
			  "Karlovarsky Kraj",
			  "Kralovehradecky Kraj",
			  "Liberecky Kraj",
			  "Moravskoslezsky Kraj",
			  "Olomoucky Kraj",
			  "Pardubicky Kraj",
			  "Plzensky Kraj",
			  "Praha",
			  "Stredocesky Kraj",
			  "Ustecky Kraj",
			  "Vysocina",
			  "Zlinsky Kraj"
			],
			"code": "+42"
		  },
		  {
			"country": "Denmark",
			"states": [
			  "Arhus",
			  "Bornholm",
			  "Frederiksberg",
			  "Frederiksborg",
			  "Fyn",
			  "Kobenhavn",
			  "Kobenhavns",
			  "Nordjylland",
			  "Ribe",
			  "Ringkobing",
			  "Roskilde",
			  "Sonderjylland",
			  "Storstrom",
			  "Vejle",
			  "Vestsjalland",
			  "Viborg"
			],
			"code": "+45"
		  },
		  {
			"country": "Djibouti",
			"states": [
			  "Ali Sabih",
			  "Dikhil",
			  "Djibouti",
			  "Obock",
			  "Tadjoura"
			],
			"code": "+253"
		  },
		  {
			"country": "Dominica",
			"states": [
			  "Saint Andrew",
			  "Saint David",
			  "Saint George",
			  "Saint John",
			  "Saint Joseph",
			  "Saint Luke",
			  "Saint Mark",
			  "Saint Patrick",
			  "Saint Paul",
			  "Saint Peter"
			],
			"code": "+1809"
		  },
		  {
			"country": "Dominican Republic",
			"states": [
			  "Azua",
			  "Baoruco",
			  "Barahona",
			  "Dajabon",
			  "Distrito Nacional",
			  "Duarte",
			  "Elias Pina",
			  "El Seibo",
			  "Espaillat",
			  "Hato Mayor",
			  "Independencia",
			  "La Altagracia",
			  "La Romana",
			  "La Vega",
			  "Maria Trinidad Sanchez",
			  "Monsenor Nouel",
			  "Monte Cristi",
			  "Monte Plata",
			  "Pedernales",
			  "Peravia",
			  "Puerto Plata",
			  "Salcedo",
			  "Samana",
			  "Sanchez Ramirez",
			  "San Cristobal",
			  "San Jose de Ocoa",
			  "San Juan",
			  "San Pedro de Macoris",
			  "Santiago",
			  "Santiago Rodriguez",
			  "Santo Domingo",
			  "Valverde"
			],
			"code": "+1809"
		  },
		  {
			"country": "Ecuador",
			"states": [
			  "Azuay",
			  "Bolivar",
			  "Canar",
			  "Carchi",
			  "Chimborazo",
			  "Cotopaxi",
			  "El Oro",
			  "Esmeraldas",
			  "Galapagos",
			  "Guayas",
			  "Imbabura",
			  "Loja",
			  "Los Rios",
			  "Manabi",
			  "Morona-Santiago",
			  "Napo",
			  "Orellana",
			  "Pastaza",
			  "Pichincha",
			  "Sucumbios",
			  "Tungurahua",
			  "Zamora-Chinchipe"
			],
			"code": "+593"
		  },
		  {
			"country": "Egypt",
			"states": [
			  "Ad Daqahliyah",
			  "Al Bahr al Ahmar",
			  "Al Buhayrah",
			  "Al Fayyum",
			  "Al Gharbiyah",
			  "Al Iskandariyah",
			  "Al Isma'iliyah",
			  "Al Jizah",
			  "Al Minufiyah",
			  "Al Minya",
			  "Al Qahirah",
			  "Al Qalyubiyah",
			  "Al Wadi al Jadid",
			  "Ash Sharqiyah",
			  "As Suways",
			  "Aswan",
			  "Asyut",
			  "Bani Suwayf",
			  "Bur Sa'id",
			  "Dumyat",
			  "Janub Sina'",
			  "Kafr ash Shaykh",
			  "Matruh",
			  "Qina",
			  "Shamal Sina'",
			  "Suhaj"
			],
			"code": "+20"
		  },
		  {
			"country": "El Salvador",
			"states": [
			  "Ahuachapan",
			  "Cabanas",
			  "Chalatenango",
			  "Cuscatlan",
			  "La Libertad",
			  "La Paz",
			  "La Union",
			  "Morazan",
			  "San Miguel",
			  "San Salvador",
			  "Santa Ana",
			  "San Vicente",
			  "Sonsonate",
			  "Usulutan"
			],
			"code": "+503"
		  },
		  {
			"country": "Equatorial Guinea",
			"states": [
			  "Annobon",
			  "Bioko Norte",
			  "Bioko Sur",
			  "Centro Sur",
			  "Kie-Ntem",
			  "Litoral",
			  "Wele-Nzas"
			],
			"code": "+240"
		  },
		  {
			"country": "Eritrea",
			"states": [
			  "Anseba",
			  "Debub",
			  "Debubawi K'eyih Bahri",
			  "Gash Barka",
			  "Ma'akel",
			  "Semenawi Keyih Bahri"
			],
			"code": "+291"
		  },
		  {
			"country": "Estonia",
			"states": [
			  "Harjumaa (Tallinn)",
			  "Hiiumaa (Kardla)",
			  "Ida-Virumaa (Johvi)",
			  "Jarvamaa (Paide)",
			  "Jogevamaa (Jogeva)",
			  "Laanemaa (Haapsalu)",
			  "Laane-Virumaa (Rakvere)",
			  "Parnumaa (Parnu)",
			  "Polvamaa (Polva)",
			  "Raplamaa (Rapla)",
			  "Saaremaa (Kuressaare)",
			  "Tartumaa (Tartu)",
			  "Valgamaa (Valga)",
			  "Viljandimaa (Viljandi)",
			  "Vorumaa (Voru)"
			],
			"code": "+372"
		  },
		  {
			"country": "Ethiopia",
			"states": [
			  "Addis Ababa",
			  "Afar",
			  "Amhara",
			  "Binshangul Gumuz",
			  "Dire Dawa",
			  "Gambela Hizboch",
			  "Harari",
			  "Oromia",
			  "Somali",
			  "Tigray",
			  "Southern Nations, Nationalities, and Peoples Region"
			],
			"code": "+251"
		  },
		  {
			"country": "Fiji",
			"states": [
			  "Central (Suva)",
			  "Eastern (Levuka)",
			  "Northern (Labasa)",
			  "Rotuma",
			  "Western (Lautoka)"
			],
			"code": "+679"
		  },
		  {
			"country": "Finland",
			"states": [
			  "Aland",
			  "Etela-Suomen Laani",
			  "Ita-Suomen Laani",
			  "Lansi-Suomen Laani",
			  "Lappi",
			  "Oulun Laani"
			],
			"code": "+358"
		  },
		  {
			"country": "France",
			"states": [
			  "Alsace",
			  "Aquitaine",
			  "Auvergne",
			  "Basse-Normandie",
			  "Bourgogne",
			  "Bretagne",
			  "Centre",
			  "Champagne-Ardenne",
			  "Corse",
			  "Franche-Comte",
			  "Haute-Normandie",
			  "Ile-de-France",
			  "Languedoc-Roussillon",
			  "Limousin",
			  "Lorraine",
			  "Midi-Pyrenees",
			  "Nord-Pas-de-Calais",
			  "Pays de la Loire",
			  "Picardie",
			  "Poitou-Charentes",
			  "Provence-Alpes-Cote d'Azur",
			  "Rhone-Alpes"
			],
			"code": "+33"
		  },
		  {
			"country": "Gabon",
			"states": [
			  "Estuaire",
			  "Haut-Ogooue",
			  "Moyen-Ogooue",
			  "Ngounie",
			  "Nyanga",
			  "Ogooue-Ivindo",
			  "Ogooue-Lolo",
			  "Ogooue-Maritime",
			  "Woleu-Ntem"
			],
			"code": "+241"
		  },
		  {
			"country": "Gambia",
			"states": [
			  "Banjul",
			  "Central River",
			  "Lower River",
			  "North Bank",
			  "Upper River",
			  "Western"
			],
			"code": "+220"
		  },
		  {
			"country": "Georgia",
			"states": [
			  "Macon–Bibb County",
			  "Georgetown–Quitman County"
			],
			"code": "+7880"
		  },
		  {
			"country": "Germany",
			"states": [
			  "Baden-Wuerttemberg",
			  "Bayern",
			  "Berlin",
			  "Brandenburg",
			  "Bremen",
			  "Hamburg",
			  "Hessen",
			  "Mecklenburg-Vorpommern",
			  "Niedersachsen",
			  "Nordrhein-Westfalen",
			  "Rheinland-Pfalz",
			  "Saarland",
			  "Sachsen",
			  "Sachsen-Anhalt",
			  "Schleswig-Holstein",
			  "Thueringen"
			],
			"code": "+49"
		  },
		  {
			"country": "Ghana",
			"states": [
			  "Ashanti",
			  "Brong-Ahafo",
			  "Central",
			  "Eastern",
			  "Greater Accra",
			  "Northern",
			  "Upper East",
			  "Upper West",
			  "Volta",
			  "Western"
			],
			"code": "+233"
		  },
		  {
			"country": "Greece",
			"states": [
			  "Agion Oros",
			  "Achaia",
			  "Aitolia kai Akarmania",
			  "Argolis",
			  "Arkadia",
			  "Arta",
			  "Attiki",
			  "Chalkidiki",
			  "Chanion",
			  "Chios",
			  "Dodekanisos",
			  "Drama",
			  "Evros",
			  "Evrytania",
			  "Evvoia",
			  "Florina",
			  "Fokidos",
			  "Fthiotis",
			  "Grevena",
			  "Ileia",
			  "Imathia",
			  "Ioannina",
			  "Irakleion",
			  "Karditsa",
			  "Kastoria",
			  "Kavala",
			  "Kefallinia",
			  "Kerkyra",
			  "Kilkis",
			  "Korinthia",
			  "Kozani",
			  "Kyklades",
			  "Lakonia",
			  "Larisa",
			  "Lasithi",
			  "Lefkas",
			  "Lesvos",
			  "Magnisia",
			  "Messinia",
			  "Pella",
			  "Pieria",
			  "Preveza",
			  "Rethynnis",
			  "Rodopi",
			  "Samos",
			  "Serrai",
			  "Thesprotia",
			  "Thessaloniki",
			  "Trikala",
			  "Voiotia",
			  "Xanthi",
			  "Zakynthos"
			],
			"code": "+30"
		  },
		  {
			"country": "Greenland",
			"states": [
			  "Avannaa (Nordgronland)",
			  "Tunu (Ostgronland)",
			  "Kitaa (Vestgronland)"
			],
			"code": "+299"
		  },
		  {
			"country": "Grenada",
			"states": [
			  "Carriacou and Petit Martinique",
			  "Saint Andrew",
			  "Saint David",
			  "Saint George",
			  "Saint John",
			  "Saint Mark",
			  "Saint Patrick"
			],
			"code": "+1473"
		  },
		  {
			"country": "Guatemala",
			"states": [
			  "Alta Verapaz",
			  "Baja Verapaz",
			  "Chimaltenango",
			  "Chiquimula",
			  "El Progreso",
			  "Escuintla",
			  "Guatemala",
			  "Huehuetenango",
			  "Izabal",
			  "Jalapa",
			  "Jutiapa",
			  "Peten",
			  "Quetzaltenango",
			  "Quiche",
			  "Retalhuleu",
			  "Sacatepequez",
			  "San Marcos",
			  "Santa Rosa",
			  "Solola",
			  "Suchitepequez",
			  "Totonicapan",
			  "Zacapa"
			],
			"code": "+502"
		  },
		  {
			"country": "Guinea",
			"states": [
			  "Beyla",
			  "Boffa",
			  "Boke",
			  "Conakry",
			  "Coyah",
			  "Dabola",
			  "Dalaba",
			  "Dinguiraye",
			  "Dubreka",
			  "Faranah",
			  "Forecariah",
			  "Fria",
			  "Gaoual",
			  "Gueckedou",
			  "Kankan",
			  "Kerouane",
			  "Kindia",
			  "Kissidougou",
			  "Koubia",
			  "Koundara",
			  "Kouroussa",
			  "Labe",
			  "Lelouma",
			  "Lola",
			  "Macenta",
			  "Mali",
			  "Mamou",
			  "Mandiana",
			  "Nzerekore",
			  "Pita",
			  "Siguiri",
			  "Telimele",
			  "Tougue",
			  "Yomou"
			],
			"code": "+224"
		  },
		  {
			"country": "Guinea - Bissau",
			"states": [
			  "Bafata",
			  "Biombo",
			  "Bissau",
			  "Bolama",
			  "Cacheu",
			  "Gabu",
			  "Oio",
			  "Quinara",
			  "Tombali"
			],
			"code": "+245"
		  },
		  {
			"country": "Guyana",
			"states": [
			  "Barima-Waini",
			  "Cuyuni-Mazaruni",
			  "Demerara-Mahaica",
			  "East Berbice-Corentyne",
			  "Essequibo Islands-West Demerara",
			  "Mahaica-Berbice",
			  "Pomeroon-Supenaam",
			  "Potaro-Siparuni",
			  "Upper Demerara-Berbice",
			  "Upper Takutu-Upper Essequibo"
			],
			"code": "+592"
		  },
		  {
			"country": "Haiti",
			"states": [
			  "Artibonite",
			  "Centre",
			  "Grand 'Anse",
			  "Nord",
			  "Nord-Est",
			  "Nord-Ouest",
			  "Ouest",
			  "Sud",
			  "Sud-Est"
			],
			"code": "+509"
		  },
		  {
			"country": "Honduras",
			"states": [
			  "Atlantida",
			  "Choluteca",
			  "Colon",
			  "Comayagua",
			  "Copan",
			  "Cortes",
			  "El Paraiso",
			  "Francisco Morazan",
			  "Gracias a Dios",
			  "Intibuca",
			  "Islas de la Bahia",
			  "La Paz",
			  "Lempira",
			  "Ocotepeque",
			  "Olancho",
			  "Santa Barbara",
			  "Valle",
			  "Yoro"
			],
			"code": "+504"
		  },
		  {
			"country": "Hong Kong",
			"states": [
			  "Wan Chai",
			  "Sham Shui Po",
			  "Kowloon City",
			  "Kwun Tong"
			],
			"code": "+852"
		  },
		  {
			"country": "Hungary",
			"states": [
			  "Bacs-Kiskun",
			  "Baranya",
			  "Bekes",
			  "Borsod-Abauj-Zemplen",
			  "Csongrad",
			  "Fejer",
			  "Gyor-Moson-Sopron",
			  "Hajdu-Bihar",
			  "Heves",
			  "Jasz-Nagykun-Szolnok",
			  "Komarom-Esztergom",
			  "Nograd",
			  "Pest",
			  "Somogy",
			  "Szabolcs-Szatmar-Bereg",
			  "Tolna",
			  "Vas",
			  "Veszprem",
			  "Zala",
			  "Bekescsaba",
			  "Debrecen",
			  "Dunaujvaros",
			  "Eger",
			  "Gyor",
			  "Hodmezovasarhely",
			  "Kaposvar",
			  "Kecskemet",
			  "Miskolc",
			  "Nagykanizsa",
			  "Nyiregyhaza",
			  "Pecs",
			  "Sopron",
			  "Szeged",
			  "Szekesfehervar",
			  "Szolnok",
			  "Szombathely",
			  "Tatabanya",
			  "Veszprem",
			  "Zalaegerszeg"
			],
			"code": "+36"
		  },
		  {
			"country": "Iceland",
			"states": [
			  "Austurland",
			  "Hofudhborgarsvaedhi",
			  "Nordhurland Eystra",
			  "Nordhurland Vestra",
			  "Sudhurland",
			  "Sudhurnes",
			  "Vestfirdhir",
			  "Vesturland"
			],
			"code": "+354"
		  },
		  {
			"country": "India",
			"states": [
			  "Andaman and Nicobar Islands",
			  "Andhra Pradesh",
			  "Arunachal Pradesh",
			  "Assam",
			  "Bihar",
			  "Chandigarh",
			  "Chhattisgarh",
			  "Dadra and Nagar Haveli",
			  "Daman and Diu",
			  "Delhi",
			  "Goa",
			  "Gujarat",
			  "Haryana",
			  "Himachal Pradesh",
			  "Jammu and Kashmir",
			  "Jharkhand",
			  "Karnataka",
			  "Kerala",
			  "Lakshadweep",
			  "Madhya Pradesh",
			  "Maharashtra",
			  "Manipur",
			  "Meghalaya",
			  "Mizoram",
			  "Nagaland",
			  "Orissa",
			  "Pondicherry",
			  "Punjab",
			  "Rajasthan",
			  "Sikkim",
			  "Tamil Nadu",
			  "Tripura",
			  "Uttaranchal",
			  "Uttar Pradesh",
			  "West Bengal"
			],
			"code": "+91"
		  },
		  {
			"country": "Indonesia",
			"states": [
			  "Aceh",
			  "Bali",
			  "Banten",
			  "Bengkulu",
			  "Gorontalo",
			  "Irian Jaya Barat",
			  "Jakarta Raya",
			  "Jambi",
			  "Jawa Barat",
			  "Jawa Tengah",
			  "Jawa Timur",
			  "Kalimantan Barat",
			  "Kalimantan Selatan",
			  "Kalimantan Tengah",
			  "Kalimantan Timur",
			  "Kepulauan Bangka Belitung",
			  "Kepulauan Riau",
			  "Lampung",
			  "Maluku",
			  "Maluku Utara",
			  "Nusa Tenggara Barat",
			  "Nusa Tenggara Timur",
			  "Papua",
			  "Riau",
			  "Sulawesi Barat",
			  "Sulawesi Selatan",
			  "Sulawesi Tengah",
			  "Sulawesi Tenggara",
			  "Sulawesi Utara",
			  "Sumatera Barat",
			  "Sumatera Selatan",
			  "Sumatera Utara",
			  "Yogyakarta"
			],
			"code": "+62"
		  },
		  {
			"country": "Iran",
			"states": [
			  "Ardabil",
			  "Azarbayjan-e Gharbi",
			  "Azarbayjan-e Sharqi",
			  "Bushehr",
			  "Chahar Mahall va Bakhtiari",
			  "Esfahan",
			  "Fars",
			  "Gilan",
			  "Golestan",
			  "Hamadan",
			  "Hormozgan",
			  "Ilam",
			  "Kerman",
			  "Kermanshah",
			  "Khorasan-e Janubi",
			  "Khorasan-e Razavi",
			  "Khorasan-e Shemali",
			  "Khuzestan",
			  "Kohgiluyeh va Buyer Ahmad",
			  "Kordestan",
			  "Lorestan",
			  "Markazi",
			  "Mazandaran",
			  "Qazvin",
			  "Qom",
			  "Semnan",
			  "Sistan va Baluchestan",
			  "Tehran",
			  "Yazd",
			  "Zanjan"
			],
			"code": "+98"
		  },
		  {
			"country": "Iraq",
			"states": [
			  "Al Anbar",
			  "Al Basrah",
			  "Al Muthanna",
			  "Al Qadisiyah",
			  "An Najaf",
			  "Arbil",
			  "As Sulaymaniyah",
			  "At Ta'mim",
			  "Babil",
			  "Baghdad",
			  "Dahuk",
			  "Dhi Qar",
			  "Diyala",
			  "Karbala'",
			  "Maysan",
			  "Ninawa",
			  "Salah ad Din",
			  "Wasit"
			],
			"code": "+964"
		  },
		  {
			"country": "Ireland",
			"states": [
			  "Carlow",
			  "Cavan",
			  "Clare",
			  "Cork",
			  "Donegal",
			  "Dublin",
			  "Galway",
			  "Kerry",
			  "Kildare",
			  "Kilkenny",
			  "Laois",
			  "Leitrim",
			  "Limerick",
			  "Longford",
			  "Louth",
			  "Mayo",
			  "Meath",
			  "Monaghan",
			  "Offaly",
			  "Roscommon",
			  "Sligo",
			  "Tipperary",
			  "Waterford",
			  "Westmeath",
			  "Wexford",
			  "Wicklow"
			],
			"code": "+353"
		  },
		  {
			"country": "Israel",
			"states": [
			  "Central",
			  "Haifa",
			  "Jerusalem",
			  "Northern",
			  "Southern",
			  "Tel Aviv"
			],
			"code": "+972"
		  },
		  {
			"country": "Italy",
			"states": [
			  "Abruzzo",
			  "Basilicata",
			  "Calabria",
			  "Campania",
			  "Emilia-Romagna",
			  "Friuli-Venezia Giulia",
			  "Lazio",
			  "Liguria",
			  "Lombardia",
			  "Marche",
			  "Molise",
			  "Piemonte",
			  "Puglia",
			  "Sardegna",
			  "Sicilia",
			  "Toscana",
			  "Trentino-Alto Adige",
			  "Umbria",
			  "Valle d'Aosta",
			  "Veneto"
			],
			"code": "+39"
		  },
		  {
			"country": "Jamaica",
			"states": [
			  "Clarendon",
			  "Hanover",
			  "Kingston",
			  "Manchester",
			  "Portland",
			  "Saint Andrew",
			  "Saint Ann",
			  "Saint Catherine",
			  "Saint Elizabeth",
			  "Saint James",
			  "Saint Mary",
			  "Saint Thomas",
			  "Trelawny",
			  "Westmoreland"
			],
			"code": "+1876"
		  },
		  {
			"country": "Japan",
			"states": [
			  "Aichi",
			  "Akita",
			  "Aomori",
			  "Chiba",
			  "Ehime",
			  "Fukui",
			  "Fukuoka",
			  "Fukushima",
			  "Gifu",
			  "Gumma",
			  "Hiroshima",
			  "Hokkaido",
			  "Hyogo",
			  "Ibaraki",
			  "Ishikawa",
			  "Iwate",
			  "Kagawa",
			  "Kagoshima",
			  "Kanagawa",
			  "Kochi",
			  "Kumamoto",
			  "Kyoto",
			  "Mie",
			  "Miyagi",
			  "Miyazaki",
			  "Nagano",
			  "Nagasaki",
			  "Nara",
			  "Niigata",
			  "Oita",
			  "Okayama",
			  "Okinawa",
			  "Osaka",
			  "Saga",
			  "Saitama",
			  "Shiga",
			  "Shimane",
			  "Shizuoka",
			  "Tochigi",
			  "Tokushima",
			  "Tokyo",
			  "Tottori",
			  "Toyama",
			  "Wakayama",
			  "Yamagata",
			  "Yamaguchi",
			  "Yamanashi"
			],
			"code": "+81"
		  },
		  {
			"country": "Jordan",
			"states": [
			  "Ajlun",
			  "Al 'Aqabah",
			  "Al Balqa'",
			  "Al Karak",
			  "Al Mafraq",
			  "'Amman",
			  "At Tafilah",
			  "Az Zarqa'",
			  "Irbid",
			  "Jarash",
			  "Ma'an",
			  "Madaba"
			],
			"code": "+962"
		  },
		  {
			"country": "Kazakhstan",
			"states": [
			  "Almaty Oblysy",
			  "Almaty Qalasy",
			  "Aqmola Oblysy",
			  "Aqtobe Oblysy",
			  "Astana Qalasy",
			  "Atyrau Oblysy",
			  "Batys Qazaqstan Oblysy",
			  "Bayqongyr Qalasy",
			  "Mangghystau Oblysy",
			  "Ongtustik Qazaqstan Oblysy",
			  "Pavlodar Oblysy",
			  "Qaraghandy Oblysy",
			  "Qostanay Oblysy",
			  "Qyzylorda Oblysy",
			  "Shyghys Qazaqstan Oblysy",
			  "Soltustik Qazaqstan Oblysy",
			  "Zhambyl Oblysy"
			],
			"code": "+7"
		  },
		  {
			"country": "Kenya",
			"states": [
			  "Central",
			  "Coast",
			  "Eastern",
			  "Nairobi Area",
			  "North Eastern",
			  "Nyanza",
			  "Rift Valley",
			  "Western"
			],
			"code": "+254"
		  },
		  {
			"country": "Kiribati",
			"states": [
			  "South Tarawa",
			  "Ocenia"
			],
			"code": "+686"
		  },
		  {
			"country": "Korea North",
			"states": [
			  "Chagang",
			  "North Hamgyong",
			  "South Hamgyong",
			  "North Hwanghae",
			  "South Hwanghae",
			  "Kangwon",
			  "North P'yongan",
			  "South P'yongan",
			  "Yanggang",
			  "Kaesong",
			  "Najin",
			  "Namp'o",
			  "Pyongyang"
			],
			"code": "+850"
		  },
		  {
			"country": "Korea South",
			"states": [
			  "Seoul",
			  "Busan City",
			  "Daegu City",
			  "Incheon City",
			  "Gwangju City",
			  "Daejeon City",
			  "Ulsan",
			  "Gyeonggi Province",
			  "Gangwon Province",
			  "North Chungcheong Province",
			  "South Chungcheong Province",
			  "North Jeolla Province",
			  "South Jeolla Province",
			  "North Gyeongsang Province",
			  "South Gyeongsang Province",
			  "Jeju"
			],
			"code": "+82"
		  },
		  {
			"country": "Kuwait",
			"states": [ "Al Ahmadi", "Al Farwaniyah", "Al Asimah", "Al Jahra", "Hawalli", "Mubarak Al-Kabeer" ],
			"code": "+965"
		  },
		  {
			"country": "Kyrgyzstan",
			"states": [ "Batken Oblasty", "Bishkek Shaary", "Chuy Oblasty", "Jalal-Abad Oblasty", "Naryn Oblasty", "Osh Oblasty", "Talas Oblasty", "Ysyk-Kol Oblasty" ],
			"code": "+996"
		  },
		  {
			"country": "Laos",
			"states": [ "Attapu", "Bokeo", "Bolikhamxai", "Champasak", "Houaphan", "Khammouan", "Louangnamtha", "Louangphrabang", "Oudomxai", "Phongsali", "Salavan", "Savannakhet", "Viangchan", "Viangchan", "Xaignabouli", "Xaisomboun", "Xekong", "Xiangkhoang" ],
			"code": "+856"
		  },
		  {
			"country": "Latvia",
			"states": [ "Aizkraukles Rajons", "Aluksnes Rajons", "Balvu Rajons", "Bauskas Rajons", "Cesu Rajons", "Daugavpils", "Daugavpils Rajons", "Dobeles Rajons", "Gulbenes Rajons", "Jekabpils Rajons", "Jelgava", "Jelgavas Rajons", "Jurmala", "Kraslavas Rajons", "Kuldigas Rajons", "Liepaja", "Liepajas Rajons", "Limbazu Rajons", "Ludzas Rajons", "Madonas Rajons", "Ogres Rajons", "Preilu Rajons", "Rezekne", "Rezeknes Rajons", "Riga", "Rigas Rajons", "Saldus Rajons", "Talsu Rajons", "Tukuma Rajons", "Valkas Rajons", "Valmieras Rajons", "Ventspils", "Ventspils Rajons" ],
			"code": "+371"
		  },
		  {
			"country": "Lebanon",
			"states": [ "Beyrouth", "Beqaa", "Liban-Nord", "Liban-Sud", "Mont-Liban", "Nabatiye" ],
			"code": "+961"
		  },
		  {
			"country": "Lesotho",
			"states": [ "Berea", "Butha-Buthe", "Leribe", "Mafeteng", "Maseru", "Mohale's Hoek", "Mokhotlong", "Qacha's Nek", "Quthing", "Thaba-Tseka" ],
			"code": "+266"
		  },
		  {
			"country": "Liberia",
			"states": [ "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland", "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe" ],
			"code": "+231"
		  },
		  {
			"country": "Libya",
			"states": [ "Ajdabiya", "Al 'Aziziyah", "Al Fatih", "Al Jabal al Akhdar", "Al Jufrah", "Al Khums", "Al Kufrah", "An Nuqat al Khams", "Ash Shati'", "Awbari", "Az Zawiyah", "Banghazi", "Darnah", "Ghadamis", "Gharyan", "Misratah", "Murzuq", "Sabha", "Sawfajjin", "Surt", "Tarabulus", "Tarhunah", "Tubruq", "Yafran", "Zlitan" ],
			"code": "+218"
		  },
		  {
			"country": "Liechtenstein",
			"states": [ "Balzers", "Eschen", "Gamprin", "Mauren", "Planken", "Ruggell", "Schaan", "Schellenberg", "Triesen", "Triesenberg", "Vaduz" ],
			"code": "+417"
		  },
		  {
			"country": "Lithuania",
			"states": [
			  "Alytaus",
			  "Kauno",
			  "Klaipedos",
			  "Marijampoles",
			  "Panevezio",
			  "Siauliu",
			  "Taurages",
			  "Telsiu",
			  "Utenos",
			  "Vilniaus"
			],
			"code": "+370"
		  },
		  {
			"country": "Luxembourg",
			"states": [
			  "Diekirch",
			  "Grevenmacher",
			  "Luxembourg"
			],
			"code": "+352"
		  },
		  {
			"country": "Macedonia",
			"states": [
			  "Aerodrom",
			  "Aracinovo",
			  "Berovo",
			  "Bitola",
			  "Bogdanci",
			  "Bogovinje",
			  "Bosilovo",
			  "Brvenica",
			  "Butel",
			  "Cair",
			  "Caska",
			  "Centar",
			  "Centar Zupa",
			  "Cesinovo",
			  "Cucer-Sandevo",
			  "Debar",
			  "Debartsa",
			  "Delcevo",
			  "Demir Hisar",
			  "Demir Kapija",
			  "Dojran",
			  "Dolneni",
			  "Drugovo",
			  "Gazi Baba",
			  "Gevgelija",
			  "Gjorce Petrov",
			  "Gostivar",
			  "Gradsko",
			  "Ilinden",
			  "Jegunovce",
			  "Karbinci",
			  "Karpos",
			  "Kavadarci",
			  "Kicevo",
			  "Kisela Voda",
			  "Kocani",
			  "Konce",
			  "Kratovo",
			  "Kriva Palanka",
			  "Krivogastani",
			  "Krusevo",
			  "Kumanovo",
			  "Lipkovo",
			  "Lozovo",
			  "Makedonska Kamenica",
			  "Makedonski Brod",
			  "Mavrovo i Rastusa",
			  "Mogila",
			  "Negotino",
			  "Novaci",
			  "Novo Selo",
			  "Ohrid",
			  "Oslomej",
			  "Pehcevo",
			  "Petrovec",
			  "Plasnica",
			  "Prilep",
			  "Probistip",
			  "Radovis",
			  "Rankovce",
			  "Resen",
			  "Rosoman",
			  "Saraj",
			  "Skopje",
			  "Sopiste",
			  "Staro Nagoricane",
			  "Stip",
			  "Struga",
			  "Strumica",
			  "Studenicani",
			  "Suto Orizari",
			  "Sveti Nikole",
			  "Tearce",
			  "Tetovo",
			  "Valandovo",
			  "Vasilevo",
			  "Veles",
			  "Vevcani",
			  "Vinica",
			  "Vranestica",
			  "Vrapciste",
			  "Zajas",
			  "Zelenikovo",
			  "Zelino",
			  "Zrnovci"
			],
			"code": "+389"
		  },
		  {
			"country": "Madagascar",
			"states": [
			  "Antananarivo",
			  "Antsiranana",
			  "Fianarantsoa",
			  "Mahajanga",
			  "Toamasina",
			  "Toliara"
			],
			"code": "+261"
		  },
		  {
			"country": "Malawi",
			"states": [
			  "Balaka",
			  "Blantyre",
			  "Chikwawa",
			  "Chiradzulu",
			  "Chitipa",
			  "Dedza",
			  "Dowa",
			  "Karonga",
			  "Kasungu",
			  "Likoma",
			  "Lilongwe",
			  "Machinga",
			  "Mangochi",
			  "Mchinji",
			  "Mulanje",
			  "Mwanza",
			  "Mzimba",
			  "Ntcheu",
			  "Nkhata Bay",
			  "Nkhotakota",
			  "Nsanje",
			  "Ntchisi",
			  "Phalombe",
			  "Rumphi",
			  "Salima",
			  "Thyolo",
			  "Zomba"
			],
			"code": "+265"
		  },
		  {
			"country": "Malaysia",
			"states": [
			  "Johor",
			  "Kedah",
			  "Kelantan",
			  "Kuala Lumpur",
			  "Labuan",
			  "Malacca",
			  "Negeri Sembilan",
			  "Pahang",
			  "Perak",
			  "Perlis",
			  "Penang",
			  "Sabah",
			  "Sarawak",
			  "Selangor",
			  "Terengganu"
			],
			"code": "+60"
		  },
		  {
			"country": "Maldives",
			"states": [
			  "Alifu",
			  "Baa",
			  "Dhaalu",
			  "Faafu",
			  "Gaafu Alifu",
			  "Gaafu Dhaalu",
			  "Gnaviyani",
			  "Haa Alifu",
			  "Haa Dhaalu",
			  "Kaafu",
			  "Laamu",
			  "Lhaviyani",
			  "Maale",
			  "Meemu",
			  "Noonu",
			  "Raa",
			  "Seenu",
			  "Shaviyani",
			  "Thaa",
			  "Vaavu"
			],
			"code": "+960"
		  },
		  {
			"country": "Mali",
			"states": [
			  "Bamako (Capital)",
			  "Gao",
			  "Kayes",
			  "Kidal",
			  "Koulikoro",
			  "Mopti",
			  "Segou",
			  "Sikasso",
			  "Tombouctou"
			],
			"code": "+223"
		  },
		  {
			"country": "Malta",
			"states": [
			  "Rabat",
			  "Senglea"
			],
			"code": "+356"
		  },
		  {
			"country": "Marshall Islands",
			"states": [
			  "Majuro"
			],
			"code": "+692"
		  },
		  {
			"country": "Mauritania",
			"states": [
			  "Adrar",
			  "Assaba",
			  "Brakna",
			  "Dakhlet Nouadhibou",
			  "Gorgol",
			  "Guidimaka",
			  "Hodh Ech Chargui",
			  "Hodh El Gharbi",
			  "Inchiri",
			  "Nouakchott",
			  "Tagant",
			  "Tiris Zemmour",
			  "Trarza"
			],
			"code": "+222"
		  },
		  {
			"country": "Mexico",
			"states": [
			  "Aguascalientes",
			  "Baja California",
			  "Baja California Sur",
			  "Campeche",
			  "Chiapas",
			  "Chihuahua",
			  "Coahuila de Zaragoza",
			  "Colima",
			  "Distrito Federal",
			  "Durango",
			  "Guanajuato",
			  "Guerrero",
			  "Hidalgo",
			  "Jalisco",
			  "Mexico",
			  "Michoacan de Ocampo",
			  "Morelos",
			  "Nayarit",
			  "Nuevo Leon",
			  "Oaxaca",
			  "Puebla",
			  "Queretaro de Arteaga",
			  "Quintana Roo",
			  "San Luis Potosi",
			  "Sinaloa",
			  "Sonora",
			  "Tabasco",
			  "Tamaulipas",
			  "Tlaxcala",
			  "Veracruz-Llave",
			  "Yucatan",
			  "Zacatecas"
			],
			"code": "+52"
		  },
		  {
			"country": "Micronesia",
			"states": [
			  "Palau",
			  "Nauru",
			  "Guam"
			],
			"code": "+691"
		  },
		  {
			"country": "Moldova",
			"states": [
			  "Anenii Noi",
			  "Basarabeasca",
			  "Briceni",
			  "Cahul",
			  "Cantemir",
			  "Calarasi",
			  "Causeni",
			  "Cimislia",
			  "Criuleni",
			  "Donduseni",
			  "Drochia",
			  "Dubasari",
			  "Edinet",
			  "Falesti",
			  "Floresti",
			  "Glodeni",
			  "Hincesti",
			  "Ialoveni",
			  "Leova",
			  "Nisporeni",
			  "Ocnita",
			  "Orhei",
			  "Rezina",
			  "Riscani",
			  "Singerei",
			  "Soldanesti",
			  "Soroca",
			  "Stefan-Voda",
			  "Straseni",
			  "Taraclia",
			  "Telenesti",
			  "Ungheni",
			  "Balti",
			  "Bender",
			  "Chisinau",
			  "Gagauzia",
			  "Stinga Nistrului"
			],
			"code": "+373"
		  },
		  {
			"country": "Monaco",
			"states": [
			  "Monaco-Ville",
			  "Monte Carlo"
			],
			"code": "+377"
		  },
		  {
			"country": "Mongolia",
			"states": [
			  "Arhangay",
			  "Bayanhongor",
			  "Bayan-Olgiy",
			  "Bulgan",
			  "Darhan Uul",
			  "Dornod",
			  "Dornogovi",
			  "Dundgovi",
			  "Dzavhan",
			  "Govi-Altay",
			  "Govi-Sumber",
			  "Hentiy",
			  "Hovd",
			  "Hovsgol",
			  "Omnogovi",
			  "Orhon",
			  "Ovorhangay",
			  "Selenge",
			  "Suhbaatar",
			  "Tov",
			  "Ulaanbaatar",
			  "Uvs"
			],
			"code": "+976"
		  },
		  {
			"country": "Morocco",
			"states": [
			  "Agadir",
			  "Al Hoceima",
			  "Azilal",
			  "Beni Mellal",
			  "Ben Slimane",
			  "Boulemane",
			  "Casablanca",
			  "Chaouen",
			  "El Jadida",
			  "El Kelaa des Sraghna",
			  "Er Rachidia",
			  "Essaouira",
			  "Fes",
			  "Figuig",
			  "Guelmim",
			  "Ifrane",
			  "Kenitra",
			  "Khemisset",
			  "Khenifra",
			  "Khouribga",
			  "Laayoune",
			  "Larache",
			  "Marrakech",
			  "Meknes",
			  "Nador",
			  "Ouarzazate",
			  "Oujda",
			  "Rabat-Sale",
			  "Safi",
			  "Settat",
			  "Sidi Kacem",
			  "Tangier",
			  "Tan-Tan",
			  "Taounate",
			  "Taroudannt",
			  "Tata",
			  "Taza",
			  "Tetouan",
			  "Tiznit"
			],
			"code": "+212"
		  },
		  {
			"country": "Mozambique",
			"states": [
			  "Cabo Delgado",
			  "Gaza",
			  "Inhambane",
			  "Manica",
			  "Maputo",
			  "Cidade de Maputo",
			  "Nampula",
			  "Niassa",
			  "Sofala",
			  "Tete",
			  "Zambezia"
			],
			"code": "+258"
		  },
		  {
			"country": "Namibia",
			"states": [
			  "Caprivi",
			  "Erongo",
			  "Hardap",
			  "Karas",
			  "Khomas",
			  "Kunene",
			  "Ohangwena",
			  "Okavango",
			  "Omaheke",
			  "Omusati",
			  "Oshana",
			  "Oshikoto",
			  "Otjozondjupa"
			],
			"code": "+264"
		  },
		  {
			"country": "Nauru",
			"states": [
			  "Abab",
			  "Abwaw",
			  "Adibor",
			  "Amet",
			  "Anabar"
			],
			"code": "+674"
		  },
		  {
			"country": "Nepal",
			"states": [
			  "Bagmati",
			  "Bheri",
			  "Dhawalagiri",
			  "Gandaki",
			  "Janakpur",
			  "Karnali",
			  "Kosi",
			  "Lumbini",
			  "Mahakali",
			  "Mechi",
			  "Narayani",
			  "Rapti",
			  "Sagarmatha",
			  "Seti"
			],
			"code": "+977"
		  },
		  {
			"country": "Netherlands",
			"states": [
			  "Drenthe",
			  "Flevoland",
			  "Friesland",
			  "Gelderland",
			  "Groningen",
			  "Limburg",
			  "Noord-Brabant",
			  "Noord-Holland",
			  "Overijssel",
			  "Utrecht",
			  "Zeeland",
			  "Zuid-Holland"
			],
			"code": "+31"
		  },
		  {
			"country": "New Zealand",
			"states": [
			  "Auckland",
			  "Bay of Plenty",
			  "Canterbury",
			  "Chatham Islands",
			  "Gisborne",
			  "Hawke's Bay",
			  "Manawatu-Wanganui",
			  "Marlborough",
			  "Nelson",
			  "Northland",
			  "Otago",
			  "Southland",
			  "Taranaki",
			  "Tasman",
			  "Waikato",
			  "Wellington",
			  "West Coast"
			],
			"code": "+64"
		  },
		  {
			"country": "Nicaragua",
			"states": [
			  "Atlantico Norte",
			  "Atlantico Sur",
			  "Boaco",
			  "Carazo",
			  "Chinandega",
			  "Chontales",
			  "Esteli",
			  "Granada",
			  "Jinotega",
			  "Leon",
			  "Madriz",
			  "Managua",
			  "Masaya",
			  "Matagalpa",
			  "Nueva Segovia",
			  "Rio San Juan",
			  "Rivas"
			],
			"code": "+505"
		  },
		  {
			"country": "Niger",
			"states": [
			  "Agadez",
			  "Diffa",
			  "Dosso",
			  "Maradi",
			  "Niamey",
			  "Tahoua",
			  "Tillaberi",
			  "Zinder"
			],
			"code": "+227"
		  },
		  {
			"country": "Nigeria",
			"states": [
			  "Abia",
			  "Abuja Federal Capital",
			  "Adamawa",
			  "Akwa Ibom",
			  "Anambra",
			  "Bauchi",
			  "Bayelsa",
			  "Benue",
			  "Borno",
			  "Cross River",
			  "Delta",
			  "Ebonyi",
			  "Edo",
			  "Ekiti",
			  "Enugu",
			  "Gombe",
			  "Imo",
			  "Jigawa",
			  "Kaduna",
			  "Kano",
			  "Katsina",
			  "Kebbi",
			  "Kogi",
			  "Kwara",
			  "Lagos",
			  "Nassarawa",
			  "Niger",
			  "Ogun",
			  "Ondo",
			  "Osun",
			  "Oyo",
			  "Plateau",
			  "Rivers",
			  "Sokoto",
			  "Taraba",
			  "Yobe",
			  "Zamfara"
			],
			"code": "+234"
		  },
		  {
			"country": "Norway",
			"states": [
			  "Akershus",
			  "Aust-Agder",
			  "Buskerud",
			  "Finnmark",
			  "Hedmark",
			  "Hordaland",
			  "More og Romsdal",
			  "Nordland",
			  "Nord-Trondelag",
			  "Oppland",
			  "Oslo",
			  "Ostfold",
			  "Rogaland",
			  "Sogn og Fjordane",
			  "Sor-Trondelag",
			  "Telemark",
			  "Troms",
			  "Vest-Agder",
			  "Vestfold"
			],
			"code": "+47"
		  },
		  {
			"country": "Oman",
			"states": [
			  "Ad Dakhiliyah",
			  "Al Batinah",
			  "Al Wusta",
			  "Ash Sharqiyah",
			  "Az Zahirah",
			  "Masqat",
			  "Musandam",
			  "Dhofar"
			],
			"code": "+968"
		  },
		  {
			"country": "Pakistan",
			"states": [
			  "Balochistan",
			  "North-West Frontier Province",
			  "Punjab",
			  "Sindh",
			  "Islamabad Capital Territory",
			  "Federally Administered Tribal Areas"
			],
			"code": "+92"
		  },
		  {
			"country": "Panama",
			"states": [
			  "Bocas del Toro",
			  "Chiriqui",
			  "Cocle",
			  "Colon",
			  "Darien",
			  "Herrera",
			  "Los Santos",
			  "Panama",
			  "San Blas",
			  "Veraguas"
			],
			"code": "+507"
		  },
		  {
			"country": "Papua New Guinea",
			"states": [
			  "Bougainville",
			  "Central",
			  "Chimbu",
			  "Eastern Highlands",
			  "East New Britain",
			  "East Sepik",
			  "Enga",
			  "Gulf",
			  "Madang",
			  "Manus",
			  "Milne Bay",
			  "Morobe",
			  "National Capital",
			  "New Ireland",
			  "Northern",
			  "Sandaun",
			  "Southern Highlands",
			  "Western",
			  "Western Highlands",
			  "West New Britain"
			],
			"code": "+675"
		  },
		  {
			"country": "Paraguay",
			"states": [
			  "Alto Paraguay",
			  "Alto Parana",
			  "Amambay",
			  "Asuncion",
			  "Boqueron",
			  "Caaguazu",
			  "Caazapa",
			  "Canindeyu",
			  "Central",
			  "Concepcion",
			  "Cordillera",
			  "Guaira",
			  "Itapua",
			  "Misiones",
			  "Neembucu",
			  "Paraguari",
			  "Presidente Hayes",
			  "San Pedro"
			],
			"code": "+595"
		  },
		  {
			"country": "Peru",
			"states": [
			  "Amazonas",
			  "Ancash",
			  "Apurimac",
			  "Arequipa",
			  "Ayacucho",
			  "Cajamarca",
			  "Callao",
			  "Cusco",
			  "Huancavelica",
			  "Huanuco",
			  "Ica",
			  "Junin",
			  "La Libertad",
			  "Lambayeque",
			  "Lima",
			  "Loreto",
			  "Madre de Dios",
			  "Moquegua",
			  "Pasco",
			  "Piura",
			  "Puno",
			  "San Martin",
			  "Tacna",
			  "Tumbes",
			  "Ucayali"
			],
			"code": "+51"
		  },
		  {
			"country": "Philippines",
			"states": [
			  "Abra",
			  "Agusan del Norte",
			  "Agusan del Sur",
			  "Aklan",
			  "Albay",
			  "Antique",
			  "Apayao",
			  "Aurora",
			  "Basilan",
			  "Bataan",
			  "Batanes",
			  "Batangas",
			  "Biliran",
			  "Benguet",
			  "Bohol",
			  "Bukidnon",
			  "Bulacan",
			  "Cagayan",
			  "Camarines Norte",
			  "Camarines Sur",
			  "Camiguin",
			  "Capiz",
			  "Catanduanes",
			  "Cavite",
			  "Cebu",
			  "Compostela",
			  "Davao del Norte",
			  "Davao del Sur",
			  "Davao Oriental",
			  "Eastern Samar",
			  "Guimaras",
			  "Ifugao",
			  "Ilocos Norte",
			  "Ilocos Sur",
			  "Iloilo",
			  "Isabela",
			  "Kalinga",
			  "Laguna",
			  "Lanao del Norte",
			  "Lanao del Sur",
			  "La Union",
			  "Leyte",
			  "Maguindanao",
			  "Marinduque",
			  "Masbate",
			  "Mindoro Occidental",
			  "Mindoro Oriental",
			  "Misamis Occidental",
			  "Misamis Oriental",
			  "Mountain Province",
			  "Negros Occidental",
			  "Negros Oriental",
			  "North Cotabato",
			  "Northern Samar",
			  "Nueva Ecija",
			  "Nueva Vizcaya",
			  "Palawan",
			  "Pampanga",
			  "Pangasinan",
			  "Quezon",
			  "Quirino",
			  "Rizal",
			  "Romblon",
			  "Samar",
			  "Sarangani",
			  "Siquijor",
			  "Sorsogon",
			  "South Cotabato",
			  "Southern Leyte",
			  "Sultan Kudarat",
			  "Sulu",
			  "Surigao del Norte",
			  "Surigao del Sur",
			  "Tarlac",
			  "Tawi-Tawi",
			  "Zambales",
			  "Zamboanga del Norte",
			  "Zamboanga del Sur",
			  "Zamboanga Sibugay"
			],
			"code": "+63"
		  },
		  {
			"country": "Poland",
			"states": [
			  "Greater Poland (Wielkopolskie)",
			  "Kuyavian-Pomeranian (Kujawsko-Pomorskie)",
			  "Lesser Poland (Malopolskie)",
			  "Lodz (Lodzkie)",
			  "Lower Silesian (Dolnoslaskie)",
			  "Lublin (Lubelskie)",
			  "Lubusz (Lubuskie)",
			  "Masovian (Mazowieckie)",
			  "Opole (Opolskie)",
			  "Podlasie (Podlaskie)",
			  "Pomeranian (Pomorskie)",
			  "Silesian (Slaskie)",
			  "Subcarpathian (Podkarpackie)",
			  "Swietokrzyskie (Swietokrzyskie)",
			  "Warmian-Masurian (Warminsko-Mazurskie)",
			  "West Pomeranian (Zachodniopomorskie)"
			],
			"code": "+48"
		  },
		  {
			"country": "Portugal",
			"states": [
			  "Aveiro",
			  "Acores",
			  "Beja",
			  "Braga",
			  "Braganca",
			  "Castelo Branco",
			  "Coimbra",
			  "Evora",
			  "Faro",
			  "Guarda",
			  "Leiria",
			  "Lisboa",
			  "Madeira",
			  "Portalegre",
			  "Porto",
			  "Santarem",
			  "Setubal",
			  "Viana do Castelo",
			  "Vila Real",
			  "Viseu"
			],
			"code": "+351"
		  },
		  {
			"country": "Qatar",
			"states": [
			  "Ad Dawhah",
			  "Al Ghuwayriyah",
			  "Al Jumayliyah",
			  "Al Khawr",
			  "Al Wakrah",
			  "Ar Rayyan",
			  "Jarayan al Batinah",
			  "Madinat ash Shamal",
			  "Umm Sa'id",
			  "Umm Salal"
			],
			"code": "+974"
		  },
		  {
			"country": "Romania",
			"states": [
			  "Alba",
			  "Arad",
			  "Arges",
			  "Bacau",
			  "Bihor",
			  "Bistrita-Nasaud",
			  "Botosani",
			  "Braila",
			  "Brasov",
			  "Bucuresti",
			  "Buzau",
			  "Calarasi",
			  "Caras-Severin",
			  "Cluj",
			  "Constanta",
			  "Covasna",
			  "Dimbovita",
			  "Dolj",
			  "Galati",
			  "Gorj",
			  "Giurgiu",
			  "Harghita",
			  "Hunedoara",
			  "Ialomita",
			  "Iasi",
			  "Ilfov",
			  "Maramures",
			  "Mehedinti",
			  "Mures",
			  "Neamt",
			  "Olt",
			  "Prahova",
			  "Salaj",
			  "Satu Mare",
			  "Sibiu",
			  "Suceava",
			  "Teleorman",
			  "Timis",
			  "Tulcea",
			  "Vaslui",
			  "Vilcea",
			  "Vrancea"
			],
			"code": "+40"
		  },
		  {
			"country": "Russia",
			"states": [
			  "Amur",
			  "Arkhangel'sk",
			  "Astrakhan'",
			  "Belgorod",
			  "Bryansk",
			  "Chelyabinsk",
			  "Chita",
			  "Irkutsk",
			  "Ivanovo",
			  "Kaliningrad",
			  "Kaluga",
			  "Kamchatka",
			  "Kemerovo",
			  "Kirov",
			  "Kostroma",
			  "Kurgan",
			  "Kursk",
			  "Leningrad",
			  "Lipetsk",
			  "Magadan",
			  "Moscow",
			  "Murmansk",
			  "Nizhniy Novgorod",
			  "Novgorod",
			  "Novosibirsk",
			  "Omsk",
			  "Orenburg",
			  "Orel",
			  "Penza",
			  "Perm'",
			  "Pskov",
			  "Rostov",
			  "Ryazan'",
			  "Sakhalin",
			  "Samara",
			  "Saratov",
			  "Smolensk",
			  "Sverdlovsk",
			  "Tambov",
			  "Tomsk",
			  "Tula",
			  "Tver'",
			  "Tyumen'",
			  "Ul'yanovsk",
			  "Vladimir",
			  "Volgograd",
			  "Vologda",
			  "Voronezh",
			  "Yaroslavl'",
			  "Adygeya",
			  "Altay",
			  "Bashkortostan",
			  "Buryatiya",
			  "Chechnya",
			  "Chuvashiya",
			  "Dagestan",
			  "Ingushetiya",
			  "Kabardino-Balkariya",
			  "Kalmykiya",
			  "Karachayevo-Cherkesiya",
			  "Kareliya",
			  "Khakasiya",
			  "Komi",
			  "Mariy-El",
			  "Mordoviya",
			  "Sakha",
			  "North Ossetia",
			  "Tatarstan",
			  "Tyva",
			  "Udmurtiya",
			  "Aga Buryat",
			  "Chukotka",
			  "Evenk",
			  "Khanty-Mansi",
			  "Komi-Permyak",
			  "Koryak",
			  "Nenets",
			  "Taymyr",
			  "Ust'-Orda Buryat",
			  "Yamalo-Nenets",
			  "Altay",
			  "Khabarovsk",
			  "Krasnodar",
			  "Krasnoyarsk",
			  "Primorskiy",
			  "Stavropol'",
			  "Moscow",
			  "St. Petersburg",
			  "Yevrey"
			],
			"code": "+7"
		  },
		  {
			"country": "Rwanda",
			"states": [
			  "Butare",
			  "Byumba",
			  "Cyangugu",
			  "Gikongoro",
			  "Gisenyi",
			  "Gitarama",
			  "Kibungo",
			  "Kibuye",
			  "Kigali Rurale",
			  "Kigali-ville",
			  "Umutara",
			  "Ruhengeri"
			],
			"code": "+250"
		  },
		  {
			"country": "San Marino",
			"states": [
			  "Acquaviva",
			  "Borgo Maggiore",
			  "Chiesanuova",
			  "Domagnano",
			  "Faetano",
			  "Fiorentino",
			  "Montegiardino",
			  "San Marino Citta",
			  "Serravalle"
			],
			"code": "+378"
		  },
		  {
			"country": "Sao Tome Principe",
			"states": [
			  "Santo Amaro",
			  "Neves",
			  "Santana"
			],
			"code": "+239"
		  },
		  {
			"country": "Saudi Arabia",
			"states": [
			  "Al Bahah",
			  "Al Hudud ash Shamaliyah",
			  "Al Jawf",
			  "Al Madinah",
			  "Al Qasim",
			  "Ar Riyad",
			  "Ash Sharqiyah",
			  "'Asir",
			  "Ha'il",
			  "Jizan",
			  "Makkah",
			  "Najran",
			  "Tabuk"
			],
			"code": "+966"
		  },
		  {
			"country": "Senegal",
			"states": [
			  "Dakar",
			  "Diourbel",
			  "Fatick",
			  "Kaolack",
			  "Kolda",
			  "Louga",
			  "Matam",
			  "Saint-Louis",
			  "Tambacounda",
			  "Thies",
			  "Ziguinchor"
			],
			"code": "+221"
		  },
		  {
			"country": "Serbia",
			"states": [
			  "Kosovo",
			  "Montenegro",
			  "Serbia",
			  "Vojvodina"
			],
			"code": "+381"
		  },
		  {
			"country": "Seychelles",
			"states": [
			  "Anse aux Pins",
			  "Anse Boileau",
			  "Anse Etoile",
			  "Anse Louis",
			  "Anse Royale",
			  "Baie Lazare",
			  "Baie Sainte Anne",
			  "Beau Vallon",
			  "Bel Air",
			  "Bel Ombre",
			  "Cascade",
			  "Glacis",
			  "Grand' Anse",
			  "Grand' Anse",
			  "La Digue",
			  "La Riviere Anglaise",
			  "Mont Buxton",
			  "Mont Fleuri",
			  "Plaisance",
			  "Pointe La Rue",
			  "Port Glaud",
			  "Saint Louis",
			  "Takamaka"
			],
			"code": "+248"
		  },
		  {
			"country": "Singapore",
			"states": [
			  "Alexandra",
			  "Bishan",
			  "Chinatown",
			  "Kallang"
			],
			"code": "+65"
		  },
		  {
			"country": "Slovak Republic",
			"states": [
			  "Banskobystricky",
			  "Bratislavsky",
			  "Kosicky",
			  "Nitriansky",
			  "Presovsky",
			  "Trenciansky",
			  "Trnavsky",
			  "Zilinsky"
			],
			"code": "+421"
		  },
		  {
			"country": "Slovenia",
			"states": [
			  "Ajdovscina",
			  "Beltinci",
			  "Benedikt",
			  "Bistrica ob Sotli",
			  "Bled",
			  "Bloke",
			  "Bohinj",
			  "Borovnica",
			  "Bovec",
			  "Braslovce",
			  "Brda",
			  "Brezice",
			  "Brezovica",
			  "Cankova",
			  "Celje",
			  "Cerklje na Gorenjskem",
			  "Cerknica",
			  "Cerkno",
			  "Cerkvenjak",
			  "Crensovci",
			  "Crna na Koroskem",
			  "Crnomelj",
			  "Destrnik",
			  "Divaca",
			  "Dobje",
			  "Dobrepolje",
			  "Dobrna",
			  "Dobrova-Horjul-Polhov Gradec",
			  "Dobrovnik-Dobronak",
			  "Dolenjske Toplice",
			  "Dol pri Ljubljani",
			  "Domzale",
			  "Dornava",
			  "Dravograd",
			  "Duplek",
			  "Gorenja Vas-Poljane",
			  "Gorisnica",
			  "Gornja Radgona",
			  "Gornji Grad",
			  "Gornji Petrovci",
			  "Grad",
			  "Grosuplje",
			  "Hajdina",
			  "Hoce-Slivnica",
			  "Hodos-Hodos",
			  "Horjul",
			  "Hrastnik",
			  "Hrpelje-Kozina",
			  "Idrija",
			  "Ig",
			  "Ilirska Bistrica",
			  "Ivancna Gorica",
			  "Izola-Isola",
			  "Jesenice",
			  "Jezersko",
			  "Jursinci",
			  "Kamnik",
			  "Kanal",
			  "Kidricevo",
			  "Kobarid",
			  "Kobilje",
			  "Kocevje",
			  "Komen",
			  "Komenda",
			  "Koper-Capodistria",
			  "Kostel",
			  "Kozje",
			  "Kranj",
			  "Kranjska Gora",
			  "Krizevci",
			  "Krsko",
			  "Kungota",
			  "Kuzma",
			  "Lasko",
			  "Lenart",
			  "Lendava-Lendva",
			  "Litija",
			  "Ljubljana",
			  "Ljubno",
			  "Ljutomer",
			  "Logatec",
			  "Loska Dolina",
			  "Loski Potok",
			  "Lovrenc na Pohorju",
			  "Luce",
			  "Lukovica",
			  "Majsperk",
			  "Maribor",
			  "Markovci",
			  "Medvode",
			  "Menges",
			  "Metlika",
			  "Mezica",
			  "Miklavz na Dravskem Polju",
			  "Miren-Kostanjevica",
			  "Mirna Pec",
			  "Mislinja",
			  "Moravce",
			  "Moravske Toplice",
			  "Mozirje",
			  "Murska Sobota",
			  "Muta",
			  "Naklo",
			  "Nazarje",
			  "Nova Gorica",
			  "Novo Mesto",
			  "Odranci",
			  "Oplotnica",
			  "Ormoz",
			  "Osilnica",
			  "Pesnica",
			  "Piran-Pirano",
			  "Pivka",
			  "Podcetrtek",
			  "Podlehnik",
			  "Podvelka",
			  "Polzela",
			  "Postojna",
			  "Prebold",
			  "Preddvor",
			  "Prevalje",
			  "Ptuj",
			  "Puconci",
			  "Race-Fram",
			  "Radece",
			  "Radenci",
			  "Radlje ob Dravi",
			  "Radovljica",
			  "Ravne na Koroskem",
			  "Razkrizje",
			  "Ribnica",
			  "Ribnica na Pohorju",
			  "Rogasovci",
			  "Rogaska Slatina",
			  "Rogatec",
			  "Ruse",
			  "Salovci",
			  "Selnica ob Dravi",
			  "Semic",
			  "Sempeter-Vrtojba",
			  "Sencur",
			  "Sentilj",
			  "Sentjernej",
			  "Sentjur pri Celju",
			  "Sevnica",
			  "Sezana",
			  "Skocjan",
			  "Skofja Loka",
			  "Skofljica",
			  "Slovenj Gradec",
			  "Slovenska Bistrica",
			  "Slovenske Konjice",
			  "Smarje pri Jelsah",
			  "Smartno ob Paki",
			  "Smartno pri Litiji",
			  "Sodrazica",
			  "Solcava",
			  "Sostanj",
			  "Starse",
			  "Store",
			  "Sveta Ana",
			  "Sveti Andraz v Slovenskih Goricah",
			  "Sveti Jurij",
			  "Tabor",
			  "Tisina",
			  "Tolmin",
			  "Trbovlje",
			  "Trebnje",
			  "Trnovska Vas",
			  "Trzic",
			  "Trzin",
			  "Turnisce",
			  "Velenje",
			  "Velika Polana",
			  "Velike Lasce",
			  "Verzej",
			  "Videm",
			  "Vipava",
			  "Vitanje",
			  "Vodice",
			  "Vojnik",
			  "Vransko",
			  "Vrhnika",
			  "Vuzenica",
			  "Zagorje ob Savi",
			  "Zalec",
			  "Zavrc",
			  "Zelezniki",
			  "Zetale",
			  "Ziri",
			  "Zirovnica",
			  "Zuzemberk",
			  "Zrece"
			],
			"code": "+386"
		  },
		  {
			"country": "Solomon Islands",
			"states": [
			  "Central",
			  "Choiseul",
			  "Guadalcanal",
			  "Honiara",
			  "Isabel",
			  "Makira",
			  "Malaita",
			  "Rennell and Bellona",
			  "Temotu",
			  "Western"
			],
			"code": "+677"
		  },
		  {
			"country": "Somalia",
			"states": [
			  "Awdal",
			  "Bakool",
			  "Banaadir",
			  "Bari",
			  "Bay",
			  "Galguduud",
			  "Gedo",
			  "Hiiraan",
			  "Jubbada Dhexe",
			  "Jubbada Hoose",
			  "Mudug",
			  "Nugaal",
			  "Sanaag",
			  "Shabeellaha Dhexe",
			  "Shabeellaha Hoose",
			  "Sool",
			  "Togdheer",
			  "Woqooyi Galbeed"
			],
			"code": "+252"
		  },
		  {
			"country": "South Africa",
			"states": [
			  "Eastern Cape",
			  "Free State",
			  "Gauteng",
			  "KwaZulu-Natal",
			  "Limpopo",
			  "Mpumalanga",
			  "North-West",
			  "Northern Cape",
			  "Western Cape"
			],
			"code": "+27"
		  },
		  {
			"country": "Spain",
			"states": [
			  "Andalucia",
			  "Aragon",
			  "Asturias",
			  "Baleares",
			  "Ceuta",
			  "Canarias",
			  "Cantabria",
			  "Castilla-La Mancha",
			  "Castilla y Leon",
			  "Cataluna",
			  "Comunidad Valenciana",
			  "Extremadura",
			  "Galicia",
			  "La Rioja",
			  "Madrid",
			  "Melilla",
			  "Murcia",
			  "Navarra",
			  "Pais Vasco"
			],
			"code": "+34"
		  },
		  {
			"country": "Sri Lanka",
			"states": [
			  "Central",
			  "North Central",
			  "North Eastern",
			  "North Western",
			  "Sabaragamuwa",
			  "Southern",
			  "Uva",
			  "Western"
			],
			"code": "+94"
		  },
		  {
			"country": "Sudan",
			"states": [
			  "A'ali an Nil",
			  "Al Bahr al Ahmar",
			  "Al Buhayrat",
			  "Al Jazirah",
			  "Al Khartum",
			  "Al Qadarif",
			  "Al Wahdah",
			  "An Nil al Abyad",
			  "An Nil al Azraq",
			  "Ash Shamaliyah",
			  "Bahr al Jabal",
			  "Gharb al Istiwa'iyah",
			  "Gharb Bahr al Ghazal",
			  "Gharb Darfur",
			  "Gharb Kurdufan",
			  "Janub Darfur",
			  "Janub Kurdufan",
			  "Junqali",
			  "Kassala",
			  "Nahr an Nil",
			  "Shamal Bahr al Ghazal",
			  "Shamal Darfur",
			  "Shamal Kurdufan",
			  "Sharq al Istiwa'iyah",
			  "Sinnar",
			  "Warab"
			],
			"code": "+249"
		  },
		  {
			"country": "Suriname",
			"states": [
			  "Brokopondo",
			  "Commewijne",
			  "Coronie",
			  "Marowijne",
			  "Nickerie",
			  "Para",
			  "Paramaribo",
			  "Saramacca",
			  "Sipaliwini",
			  "Wanica"
			],
			"code": "+597"
		  },
		  {
			"country": "Swaziland",
			"states": [
			  "Hhohho",
			  "Lubombo",
			  "Manzini",
			  "Shiselweni"
			],
			"code": "+268"
		  },
		  {
			"country": "Sweden",
			"states": [
			  "Blekinge",
			  "Dalarnas",
			  "Gavleborgs",
			  "Gotlands",
			  "Hallands",
			  "Jamtlands",
			  "Jonkopings",
			  "Kalmar",
			  "Kronobergs",
			  "Norrbottens",
			  "Orebro",
			  "Ostergotlands",
			  "Skane",
			  "Sodermanlands",
			  "Stockholms",
			  "Uppsala",
			  "Varmlands",
			  "Vasterbottens",
			  "Vasternorrlands",
			  "Vastmanlands",
			  "Vastra Gotalands"
			],
			"code": "+46"
		  },
		  {
			"country": "Switzerland",
			"states": [
			  "Aargau",
			  "Appenzell Ausser-Rhoden",
			  "Appenzell Inner-Rhoden",
			  "Basel-Landschaft",
			  "Basel-Stadt",
			  "Bern",
			  "Fribourg",
			  "Geneve",
			  "Glarus",
			  "Graubunden",
			  "Jura",
			  "Luzern",
			  "Neuchatel",
			  "Nidwalden",
			  "Obwalden",
			  "Sankt Gallen",
			  "Schaffhausen",
			  "Schwyz",
			  "Solothurn",
			  "Thurgau",
			  "Ticino",
			  "Uri",
			  "Valais",
			  "Vaud",
			  "Zug",
			  "Zurich"
			],
			"code": "+41"
		  },
		  {
			"country": "Syria",
			"states": [
			  "Al Hasakah",
			  "Al Ladhiqiyah",
			  "Al Qunaytirah",
			  "Ar Raqqah",
			  "As Suwayda'",
			  "Dar'a",
			  "Dayr az Zawr",
			  "Dimashq",
			  "Halab",
			  "Hamah",
			  "Hims",
			  "Idlib",
			  "Rif Dimashq",
			  "Tartus"
			],
			"code": "+963"
		  },
		  {
			"country": "Taiwan",
			"states": [
			  "Chang-hua",
			  "Chia-i",
			  "Hsin-chu",
			  "Hua-lien",
			  "I-lan",
			  "Kao-hsiung",
			  "Kin-men",
			  "Lien-chiang",
			  "Miao-li",
			  "Nan-t'ou",
			  "P'eng-hu",
			  "P'ing-tung",
			  "T'ai-chung",
			  "T'ai-nan",
			  "T'ai-pei",
			  "T'ai-tung",
			  "T'ao-yuan",
			  "Yun-lin",
			  "Chia-i",
			  "Chi-lung",
			  "Hsin-chu",
			  "T'ai-chung",
			  "T'ai-nan",
			  "Kao-hsiung city",
			  "T'ai-pei city"
			],
			"code": "+886"
		  },
		  {
			"country": "Tajikstan",
			"states": [
			  "Dushanbe",
			  "Khujand",
			  "Qurghonteppa",
			  "Tursunzoda"
			],
			"code": "+7"
		  },
		  {
			"country": "Thailand",
			"states": [
			  "Amnat Charoen",
			  "Ang Thong",
			  "Buriram",
			  "Chachoengsao",
			  "Chai Nat",
			  "Chaiyaphum",
			  "Chanthaburi",
			  "Chiang Mai",
			  "Chiang Rai",
			  "Chon Buri",
			  "Chumphon",
			  "Kalasin",
			  "Kamphaeng Phet",
			  "Kanchanaburi",
			  "Khon Kaen",
			  "Krabi",
			  "Krung Thep Mahanakhon",
			  "Lampang",
			  "Lamphun",
			  "Loei",
			  "Lop Buri",
			  "Mae Hong Son",
			  "Maha Sarakham",
			  "Mukdahan",
			  "Nakhon Nayok",
			  "Nakhon Pathom",
			  "Nakhon Phanom",
			  "Nakhon Ratchasima",
			  "Nakhon Sawan",
			  "Nakhon Si Thammarat",
			  "Nan",
			  "Narathiwat",
			  "Nong Bua Lamphu",
			  "Nong Khai",
			  "Nonthaburi",
			  "Pathum Thani",
			  "Pattani",
			  "Phangnga",
			  "Phatthalung",
			  "Phayao",
			  "Phetchabun",
			  "Phetchaburi",
			  "Phichit",
			  "Phitsanulok",
			  "Phra Nakhon Si Ayutthaya",
			  "Phrae",
			  "Phuket",
			  "Prachin Buri",
			  "Prachuap Khiri Khan",
			  "Ranong",
			  "Ratchaburi",
			  "Rayong",
			  "Roi Et",
			  "Sa Kaeo",
			  "Sakon Nakhon",
			  "Samut Prakan",
			  "Samut Sakhon",
			  "Samut Songkhram",
			  "Sara Buri",
			  "Satun",
			  "Sing Buri",
			  "Sisaket",
			  "Songkhla",
			  "Sukhothai",
			  "Suphan Buri",
			  "Surat Thani",
			  "Surin",
			  "Tak",
			  "Trang",
			  "Trat",
			  "Ubon Ratchathani",
			  "Udon Thani",
			  "Uthai Thani",
			  "Uttaradit",
			  "Yala",
			  "Yasothon"
			],
			"code": "+66"
		  },
		  {
			"country": "Togo",
			"states": [
			  "Kara",
			  "Plateaux",
			  "Savanes",
			  "Centrale",
			  "Maritime"
			],
			"code": "+228"
		  },
		  {
			"country": "Tonga",
			"states": [
			  "Tongatapu",
			  "Nuku'alofa",
			  "Ha'amonga ʻa Maui"
			],
			"code": "+676"
		  },
		  {
			"country": "Trinidad & Tobago",
			"states": [
			  "Couva",
			  "Diego Martin",
			  "Mayaro",
			  "Penal",
			  "Princes Town",
			  "Sangre Grande",
			  "San Juan",
			  "Siparia",
			  "Tunapuna",
			  "Port-of-Spain",
			  "San Fernando",
			  "Arima",
			  "Point Fortin",
			  "Chaguanas",
			  "Tobago"
			],
			"code": "+1868"
		  },
		  {
			"country": "Tunisia",
			"states": [
			  "Ariana (Aryanah)",
			  "Beja (Bajah)",
			  "Ben Arous (Bin 'Arus)",
			  "Bizerte (Banzart)",
			  "Gabes (Qabis)",
			  "Gafsa (Qafsah)",
			  "Jendouba (Jundubah)",
			  "Kairouan (Al Qayrawan)",
			  "Kasserine (Al Qasrayn)",
			  "Kebili (Qibili)",
			  "Kef (Al Kaf)",
			  "Mahdia (Al Mahdiyah)",
			  "Manouba (Manubah)",
			  "Medenine (Madanin)",
			  "Monastir (Al Munastir)",
			  "Nabeul (Nabul)",
			  "Sfax (Safaqis)",
			  "Sidi Bou Zid (Sidi Bu Zayd)",
			  "Siliana (Silyanah)",
			  "Sousse (Susah)",
			  "Tataouine (Tatawin)",
			  "Tozeur (Tawzar)",
			  "Tunis",
			  "Zaghouan (Zaghwan)"
			],
			"code": "+216"
		  },
		  {
			"country": "Turkey",
			"states": [
			  "Adana",
			  "Adiyaman",
			  "Afyonkarahisar",
			  "Agri",
			  "Aksaray",
			  "Amasya",
			  "Ankara",
			  "Antalya",
			  "Ardahan",
			  "Artvin",
			  "Aydin",
			  "Balikesir",
			  "Bartin",
			  "Batman",
			  "Bayburt",
			  "Bilecik",
			  "Bingol",
			  "Bitlis",
			  "Bolu",
			  "Burdur",
			  "Bursa",
			  "Canakkale",
			  "Cankiri",
			  "Corum",
			  "Denizli",
			  "Diyarbakir",
			  "Duzce",
			  "Edirne",
			  "Elazig",
			  "Erzincan",
			  "Erzurum",
			  "Eskisehir",
			  "Gaziantep",
			  "Giresun",
			  "Gumushane",
			  "Hakkari",
			  "Hatay",
			  "Igdir",
			  "Isparta",
			  "Istanbul",
			  "Izmir",
			  "Kahramanmaras",
			  "Karabuk",
			  "Karaman",
			  "Kars",
			  "Kastamonu",
			  "Kayseri",
			  "Kilis",
			  "Kirikkale",
			  "Kirklareli",
			  "Kirsehir",
			  "Kocaeli",
			  "Konya",
			  "Kutahya",
			  "Malatya",
			  "Manisa",
			  "Mardin",
			  "Mersin",
			  "Mugla",
			  "Mus",
			  "Nevsehir",
			  "Nigde",
			  "Ordu",
			  "Osmaniye",
			  "Rize",
			  "Sakarya",
			  "Samsun",
			  "Sanliurfa",
			  "Siirt",
			  "Sinop",
			  "Sirnak",
			  "Sivas",
			  "Tekirdag",
			  "Tokat",
			  "Trabzon",
			  "Tunceli",
			  "Usak",
			  "Van",
			  "Yalova",
			  "Yozgat",
			  "Zonguldak"
			],
			"code": "+90"
		  },
		  {
			"country": "Turkmenistan",
			"states": [
			  "Ahal Welayaty (Ashgabat)",
			  "Balkan Welayaty (Balkanabat)",
			  "Dashoguz Welayaty",
			  "Lebap Welayaty (Turkmenabat)",
			  "Mary Welayaty"
			],
			"code": "+993"
		  },
		  {
			"country": "Uganda",
			"states": [
			  "Adjumani",
			  "Apac",
			  "Arua",
			  "Bugiri",
			  "Bundibugyo",
			  "Bushenyi",
			  "Busia",
			  "Gulu",
			  "Hoima",
			  "Iganga",
			  "Jinja",
			  "Kabale",
			  "Kabarole",
			  "Kaberamaido",
			  "Kalangala",
			  "Kampala",
			  "Kamuli",
			  "Kamwenge",
			  "Kanungu",
			  "Kapchorwa",
			  "Kasese",
			  "Katakwi",
			  "Kayunga",
			  "Kibale",
			  "Kiboga",
			  "Kisoro",
			  "Kitgum",
			  "Kotido",
			  "Kumi",
			  "Kyenjojo",
			  "Lira",
			  "Luwero",
			  "Masaka",
			  "Masindi",
			  "Mayuge",
			  "Mbale",
			  "Mbarara",
			  "Moroto",
			  "Moyo",
			  "Mpigi",
			  "Mubende",
			  "Mukono",
			  "Nakapiripirit",
			  "Nakasongola",
			  "Nebbi",
			  "Ntungamo",
			  "Pader",
			  "Pallisa",
			  "Rakai",
			  "Rukungiri",
			  "Sembabule",
			  "Sironko",
			  "Soroti",
			  "Tororo",
			  "Wakiso",
			  "Yumbe"
			],
			"code": "+256"
		  },
		  {
			"country": "Ukraine",
			"states": [
			  "Cherkasy",
			  "Chernihiv",
			  "Chernivtsi",
			  "Crimea",
			  "Dnipropetrovs'k",
			  "Donets'k",
			  "Ivano-Frankivs'k",
			  "Kharkiv",
			  "Kherson",
			  "Khmel'nyts'kyy",
			  "Kirovohrad",
			  "Kiev",
			  "Kyyiv",
			  "Luhans'k",
			  "L'viv",
			  "Mykolayiv",
			  "Odesa",
			  "Poltava",
			  "Rivne",
			  "Sevastopol'",
			  "Sumy",
			  "Ternopil'",
			  "Vinnytsya",
			  "Volyn'",
			  "Zakarpattya",
			  "Zaporizhzhya",
			  "Zhytomyr"
			],
			"code": "+380"
		  },
		  {
			"country": "United Arab Emirates",
			"states": [
			  "Abu Dhabi",
			  "'Ajman",
			  "Al Fujayrah",
			  "Sharjah",
			  "Dubai",
			  "Ra's al Khaymah",
			  "Umm al Qaywayn"
			],
			"code": "+971"
		  },
		  {
			"country": "Uruguay",
			"states": [
			  "Artigas",
			  "Canelones",
			  "Cerro Largo",
			  "Colonia",
			  "Durazno",
			  "Flores",
			  "Florida",
			  "Lavalleja",
			  "Maldonado",
			  "Montevideo",
			  "Paysandu",
			  "Rio Negro",
			  "Rivera",
			  "Rocha",
			  "Salto",
			  "San Jose",
			  "Soriano",
			  "Tacuarembo",
			  "Treinta y Tres"
			],
			"code": "+598"
		  },
		  {
			"country": "Uzbekistan",
			"states": [
			  "Andijon Viloyati",
			  "Buxoro Viloyati",
			  "Farg'ona Viloyati",
			  "Jizzax Viloyati",
			  "Namangan Viloyati",
			  "Navoiy Viloyati",
			  "Qashqadaryo Viloyati",
			  "Qaraqalpog'iston Respublikasi",
			  "Samarqand Viloyati",
			  "Sirdaryo Viloyati",
			  "Surxondaryo Viloyati",
			  "Toshkent Shahri",
			  "Toshkent Viloyati",
			  "Xorazm Viloyati"
			],
			"code": "+7"
		  },
		  {
			"country": "Vanuatu",
			"states": [ "Malampa", "Penama", "Sanma", "Shefa", "Tafea", "Torba" ],
			"code": "+678"
		  },
		  {
			"country": "Venezuela",
			"states": [ "Amazonas", "Anzoategui", "Apure", "Aragua", "Barinas", "Bolivar", "Carabobo", "Cojedes", "Delta Amacuro", "Dependencias Federales", "Distrito Federal", "Falcon", "Guarico", "Lara", "Merida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Tachira", "Trujillo", "Vargas", "Yaracuy", "Zulia" ],
			"code": "+58"
		  },
		  {
			"country": "Vietnam",
			"states": [ "An Giang", "Bac Giang", "Bac Kan", "Bac Lieu", "Bac Ninh", "Ba Ria-Vung Tau", "Ben Tre", "Binh Dinh", "Binh Duong", "Binh Phuoc", "Binh Thuan", "Ca Mau", "Cao Bang", "Dac Lak", "Dac Nong", "Dien Bien", "Dong Nai", "Dong Thap", "Gia Lai", "Ha Giang", "Hai Duong", "Ha Nam", "Ha Tay", "Ha Tinh", "Hau Giang", "Hoa Binh", "Hung Yen", "Khanh Hoa", "Kien Giang", "Kon Tum", "Lai Chau", "Lam Dong", "Lang Son", "Lao Cai", "Long An", "Nam Dinh", "Nghe An", "Ninh Binh", "Ninh Thuan", "Phu Tho", "Phu Yen", "Quang Binh", "Quang Nam", "Quang Ngai", "Quang Ninh", "Quang Tri", "Soc Trang", "Son La", "Tay Ninh", "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien-Hue", "Tien Giang", "Tra Vinh", "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai", "Can Tho", "Da Nang", "Hai Phong", "Hanoi", "Ho Chi Minh" ],
			"code": "+84"
		  },
		  {
			"country": "Yemen (North)",
			"states": [
			  "Abyan",
			  "'Adan",
			  "Ad Dali'",
			  "Al Bayda'",
			  "Al Hudaydah",
			  "Al Jawf",
			  "Al Mahrah",
			  "Al Mahwit",
			  "'Amran",
			  "Dhamar",
			  "Hadramawt",
			  "Hajjah",
			  "Ibb",
			  "Lahij",
			  "Ma'rib",
			  "Sa'dah",
			  "San'a'",
			  "Shabwah",
			  "Ta'izz"
			],
			"code": "+969"
		  },
		  {
			"country": "Yemen (South)",
			"states": [
			  "Abyan",
			  "'Adan",
			  "Ad Dali'",
			  "Al Bayda'",
			  "Al Hudaydah",
			  "Al Jawf",
			  "Al Mahrah",
			  "Al Mahwit",
			  "'Amran",
			  "Dhamar",
			  "Hadramawt",
			  "Hajjah",
			  "Ibb",
			  "Lahij",
			  "Ma'rib",
			  "Sa'dah",
			  "San'a'",
			  "Shabwah",
			  "Ta'izz"
			],
			"code": "+967"
		  },
		  {
			"country": "Zambia",
			"states": [
			  "Central",
			  "Copperbelt",
			  "Eastern",
			  "Luapula",
			  "Lusaka",
			  "Northern",
			  "North-Western",
			  "Southern",
			  "Western"
			],
			"code": "+260"
		  },
		  {
			"country": "Zimbabwe",
			"states": [
			  "Bulawayo",
			  "Harare",
			  "Manicaland",
			  "Mashonaland Central",
			  "Mashonaland East",
			  "Mashonaland West",
			  "Masvingo",
			  "Matabeleland North",
			  "Matabeleland South",
			  "Midlands"
			],
			"code": "+263"
		  }
		]

		
		nationalityList: any  = [
			"Afghan",
			"Albanian",
			"Algerian",
			"American",
			"Andorran",
			"Angolan",
			"Antiguans",
			"Argentinean",
			"Armenian",
			"Australian",
			"Austrian",
			"Azerbaijani",
			"Bahamian",
			"Bahraini",
			"Bangladeshi",
			"Barbadian",
			"Barbudans",
			"Batswana",
			"Belarusian",
			"Belgian",
			"Belizean",
			"Beninese",
			"Bhutanese",
			"Bolivian",
			"Bosnian",
			"Brazilian",
			"British",
			"Bruneian",
			"Bulgarian",
			"Burkinabe",
			"Burmese",
			"Burundian",
			"Cambodian",
			"Cameroonian",
			"Canadian",
			"Cape Verdean",
			"Central African",
			"Chadian",
			"Chilean",
			"Chinese",
			"Colombian",
			"Comoran",
			"Congolese",
			"Costa Rican",
			"Croatian",
			"Cuban",
			"Cypriot",
			"Czech",
			"Danish",
			"Djibouti",
			"Dominican",
			"Dutch",
			"East Timorese",
			"Ecuadorean",
			"Egyptian",
			"Emirian",
			"Equatorial Guinean",
			"Eritrean",
			"Estonian",
			"Ethiopian",
			"Fijian",
			"Filipino",
			"Finnish",
			"French",
			"Gabonese",
			"Gambian",
			"Georgian",
			"German",
			"Ghanaian",
			"Greek",
			"Grenadian",
			"Guatemalan",
			"Guinea-Bissauan",
			"Guinean",
			"Guyanese",
			"Haitian",
			"Herzegovinian",
			"Honduran",
			"Hungarian",
			"I-Kiribati",
			"Icelander",
			"Indian",
			"Indonesian",
			"Iranian",
			"Iraqi",
			"Irish",
			"Israeli",
			"Italian",
			"Ivorian",
			"Jamaican",
			"Japanese",
			"Jordanian",
			"Kazakhstani",
			"Kenyan",
			"Kittian and Nevisian",
			"Kuwaiti",
			"Kyrgyz",
			"Laotian",
			"Latvian",
			"Lebanese",
			"Liberian",
			"Libyan",
			"Liechtensteiner",
			"Lithuanian",
			"Luxembourger",
			"Macedonian",
			"Malagasy",
			"Malawian",
			"Malaysian",
			"Maldivan",
			"Malian",
			"Maltese",
			"Marshallese",
			"Mauritanian",
			"Mauritian",
			"Mexican",
			"Micronesian",
			"Moldovan",
			"Monacan",
			"Mongolian",
			"Moroccan",
			"Mosotho",
			"Motswana",
			"Mozambican",
			"Namibian",
			"Nauruan",
			"Nepalese",
			"New Zealander",
			"Nicaraguan",
			"Nigerian",
			"Nigerien",
			"North Korean",
			"Northern Irish",
			"Norwegian",
			"Omani",
			"Pakistani",
			"Palauan",
			"Panamanian",
			"Papua New Guinean",
			"Paraguayan",
			"Peruvian",
			"Polish",
			"Portuguese",
			"Qatari",
			"Romanian",
			"Russian",
			"Rwandan",
			"Saint Lucian",
			"Salvadoran",
			"Samoan",
			"San Marinese",
			"Sao Tomean",
			"Saudi",
			"Scottish",
			"Senegalese",
			"Serbian",
			"Seychellois",
			"Sierra Leonean",
			"Singaporean",
			"Slovakian",
			"Slovenian",
			"Solomon Islander",
			"Somali",
			"South African",
			"South Korean",
			"Spanish",
			"Sri Lankan",
			"Sudanese",
			"Surinamer",
			"Swazi",
			"Swedish",
			"Swiss",
			"Syrian",
			"Taiwanese",
			"Tajik",
			"Tanzanian",
			"Thai",
			"Togolese",
			"Tongan",
			"Trinidadian or Tobagonian",
			"Tunisian",
			"Turkish",
			"Tuvaluan",
			"Ugandan",
			"Ukrainian",
			"Uruguayan",
			"Uzbekistani",
			"Venezuelan",
			"Vietnamese",
			"Welsh",
			"Yemenite",
			"Zambian",
			"Zimbabwean"
		]	  
}

