kiosk.filter('base64', function() {
    return function(input, format) {
        if (typeof(input) != "undefined" && !_.isEmpty(input)) {
            return 'data:image/' + format + ';base64,' + input;
        }
        return null;
    };
});