/**
 * Created by cbjiang on 2017/2/26.
 */
if(typeof LoginApp=="object"){
	LoginApp.constant('SYSNAME', "hm-ajs-core");
	LoginApp.constant('GATEWAYURL', "http://192.168.8.116:8888/");
	LoginApp.constant('INDEXURL', "demo/index.html");
}

if(typeof HMApp=="object"){
	HMApp.constant('SYSNAME', "hm-ajs-core");
	HMApp.constant('GATEWAYURL', "http://192.168.8.116:8888/");
	HMApp.constant('LOGINURL', "demo/login.html");

	HMApp.constant('FILESERVICE',"http://localhost:8080/rest/v1/file/");
	HMApp.constant('FILESYSTEMNAME',"tempSystem");
	HMApp.constant('FILEDIRNAME',"tempDir");
}

