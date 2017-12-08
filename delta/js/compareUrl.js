define(function (require, exports, module) {

	return function (comparedUrl, isIframe){

		var sourceRelativeUrl = (isIframe == true) ? sessionStorage.getItem('parentPath') : window.location.pathname.split('#')[0],
		    sourceAbsoluteUrl = (isIframe == true) ? sessionStorage.getItem('parentHost') + sessionStorage.getItem('parentPath') : window.location.host + window.location.pathname.split('#')[0],
			sourceRelativeUrlSegments = sourceRelativeUrl.split('#')[0].split('/');
			sourceAbsoluteUrlSegments = sourceAbsoluteUrl.split('#')[0].split('/');
			comparedUrlSegments = comparedUrl.split('#')[0].split('/');
			check = false,
			weight = 0,
			urlItemType = {
                path : (comparedUrl.substring(0,1) == '/') ? 'relative' : 'absolute',
        		object : (comparedUrl.substring(comparedUrl.length-1,comparedUrl.length) == '/') ? 'folder' : 'file'
        	};
        	result = {};
       		
       	
		
		if (urlItemType.path =='absolute' && urlItemType.object == 'file'){
			if (comparedUrl == sourceAbsoluteUrl) {
				check = true;
				weight = 999;
				//console.log(check, urlItemType,comparedUrl, sourceAbsoluteUrl);
			}
		}

		if (urlItemType.path =='relative' && urlItemType.object == 'file'){
			if (comparedUrl == sourceRelativeUrl) {
				check = true;
				weight = 998;
				//console.log(check, urlItemType,comparedUrl, sourceRelativeUrl);
			}
		}

		if (urlItemType.path =='relative' && urlItemType.object == 'folder'){
			//console.log (comparedUrl);

			for(let i=0; i<comparedUrlSegments.length-1; i++){

				var current = i+1;
				if (comparedUrlSegments[i] == sourceRelativeUrlSegments[i]){
					weight++
				}
				check = (current == weight) ? true : false;
			}
			//console.log(check, comparedUrl + ' = ' + sourceRelativeUrl, current + '=' + weight);

		}

		if (urlItemType.path =='absolute' && urlItemType.object == 'folder'){
			//console.log (comparedUrl);

			for(let i=0; i<comparedUrlSegments.length-1; i++){

				var current = i+1;
				if (comparedUrlSegments[i] == sourceAbsoluteUrlSegments[i]){
					weight++
				}
				check = (current == weight) ? true : false;
			}
			//console.log(check, comparedUrl + ' = ' + sourceAbsoluteUrl, current + '=' + weight);

		}
		
		result = {
			check: check,
			weight: weight
		}

		return result; 

	}
	
});