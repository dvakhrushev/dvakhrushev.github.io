var uploadFiles = function(cp, formData) {

    var uploadFilesEndpoint = 'files?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

    return sendXhr(cp, uploadFilesEndpoint, 'POST', formData);
    
};