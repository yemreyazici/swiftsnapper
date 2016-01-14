declare var Hashes: any;
var sha256 = new Hashes.SHA256

namespace Snapchat {
    export class Agent{
        public SNAPCHAT_BASE_ENDPOINT = 'https://app.snapchat.com';
        public SNAPCHAT_EVENTS_ENDPOINT = 'https://sc-analytics.appspot.com/post_events';
        public SNAPCHAT_ANALYTICS_ENDPOINT = 'https://sc-analytics.appspot.com/analytics/b';
        public SNAPCHAT_HASH_PATTERN = '0001110111101110001111010101111011010001001110011000110001000110';
        public SNAPCHAT_API_SECRET = 'iEk21fuwZApXlz93750dmW22pw389dPwOk';
        public SNAPCHAT_API_STATIC_TOKEN = 'm198sOkJEn37DjqZ32lpRu76xmw288xSQ9';
        public SNAPCHAT_AUTH_TOKEN = null;
        public SNAPCHAT_USER_AGENT = null;
        public SNAPCHAT_VERSION = '9.18.2.0';

        private CURRENT_USER_REFERENCE: Snapchat.User;

        public Initialize(cur) {
            this.CURRENT_USER_REFERENCE = cur;

            return new Promise((resolve) => {
                resolve(this);
            });
        }

        /*
            Generates a UNIX timestamp
        */
        public GenerateTimeStamp() {
            return Math.round((new Date).getTime());
        }

        /*
            Generates req_token
            based on https://github.com/cuonic/SnapchatDevWiki/wiki/Generating-the-req_token
        */
        public GenerateRequestToken(token, timestamp) {
            let hash1: string = sha256.hex(this.SNAPCHAT_API_SECRET + token);
            let hash2: string = sha256.hex(timestamp.toString() + this.SNAPCHAT_API_SECRET);

            let res = '';
            for (var n = 0; n < this.SNAPCHAT_HASH_PATTERN.length; n++) {
                if (parseInt(this.SNAPCHAT_HASH_PATTERN.substr(n, 1))) {
                    res += hash2[n];
                } else {
                    res += hash1[n];
                }
            }
            return res;
        }

        /*
            Generates X-Snapchat headers
        */
        public GenerateSnapchatHeaders() {
            let UUID = '';

            let AUTH_CLIENT_TOKE = '';
        }

        /*
	        Post request to Snapchat's API
        */
        public PostSnapchat(URI, parameters, headers?): Promise<string> {
            if (headers == null) {
                headers = {};
            }

            if (URI == null || parameters == null)
                return null;
            URI = new Windows.Foundation.Uri(this.SNAPCHAT_BASE_ENDPOINT + URI);

            let REQ = Windows.Web['Http'].HttpStringContent(this.ArrayToURIParameters(parameters, false), Windows.Storage.Streams.UnicodeEncoding.utf8, 'application/x-www-form-urlencoded'),
                HTTP = new Windows.Web['Http'].HttpClient(),
                HEAD = HTTP.defaultRequestHeaders;

            HEAD = Snapchat.Http.ConfigureHeaders(HEAD, headers);

            return new Promise((resolve) => {
                let promise = HTTP.postAsync(URI, REQ).done(function (res) {
                    res.content.readAsStringAsync().done(function (e) {
                        resolve(e)
                    });
                });
            });
        }

        /*
	        Converts an Array of Arrys to uri parameters
	        Ex. input [['para1', 'val1'], ['para2', 'val2'], ['para3', 'val3']].
        */
        public ArrayToURIParameters(data: Array<Array<string>>, shouldSort) {
            if (shouldSort) {
                data = data.sort(function (a, b) {
                    return a[0] > b[0] ? 1 : -1;
                })
            }

            var res = '';
            for (var n = 0; n < data.length; n++) {
                if (res != '') {
                    res += '&';
                }
                res += data[n][0] + '=' + data[n][1];
            }
            return res;
        }
    }

    export module Http {
        export function ConfigureHeaders(HEAD, headers) {

            //TODO: Custom headers?
            if (typeof headers['Accept-Encoding'] !== 'undefined') {
                HEAD.acceptEncoding.clear();
                HEAD.acceptEncoding.parseAdd(headers['Accept-Encoding']);
            }

            if (typeof headers.Accept !== 'undefined')
                HEAD.accept.parseAdd(headers.Accept);

            if (typeof headers['Accept-Language'] !== 'undefined')
                HEAD.acceptLanguage.parseAdd(headers['Accept-Language']);

            if (typeof headers['Accept-Locale'] !== 'undefined')
                HEAD.append('Accept-Locale', headers['Accept-Locale']);

            if (typeof headers.Connection !== 'undefined')
                HEAD.connection.parseAdd(headers.Connection);

            if (typeof headers['Cache-Control'] !== 'undefined')
                HEAD.cacheControl.parseAdd(headers.CacheControl);

            if (typeof headers['User-Agent'] !== 'undefined')
                HEAD.userAgent.parseAdd(headers['User-Agent']);

            if (typeof headers['X-Snapchat-Client-Token'] !== 'undefined')
                HEAD.append('X-Snapchat-Client-Token', headers['X-Snapchat-Client-Token']);

            if (typeof headers['X-Snapchat-Client-Auth-Token'] !== 'undefined')
                HEAD.append('X-Snapchat-Client-Auth-Token', headers['X-Snapchat-Client-Auth-Token']);

            if (typeof headers['X-Snapchat-UUID'] !== 'undefined')
                HEAD.append('X-Snapchat-UUID', headers['X-Snapchat-UUID']);

            if (typeof headers['X-Timestamp'] !== 'undefined')
                HEAD.append('X-Timestamp', headers['X-Timestamp']);

            return HEAD;
        }
    }
}