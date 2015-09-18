window.AppService = {
    fetchAppData: function(options, success, error) {
        if (AppConf.env == 'rest') {
            net.get({
                url: AppConf.host + 'api/users/app_info.json',
                success: function(data, textStatus, jqXHR) {
                    success(data, textStatus, jqXHR);
                },
                error: function(data, textStatus) {
                    error(data, textStatus);
                }
            });
        } else if (AppConf.env == 'test') {
            data = {
                app_env: "development",
                release_version: "v2.0.0-edge: n/a",
                subdomain: "360lex",
                host_name: "10.0.2.2: vagrant-ubuntu-trusty-64"
            };
            success(data);
        }
    },
    fetchVisitor: function(options, success, error) {
        if (AppConf.env == 'rest') {
            net.get({
                url: AppConf.host + 'api/visitors.json?doc_type=' + options.doc_type + '&doc_id=' + options.doc_id,
                success: function(data, textStatus, jqXHR) {
                    success(data, textStatus, jqXHR);
                },
                error: function(data, textStatus) {
                    error(data, textStatus);
                }
            });
        } else if (AppConf.env == 'test') {
            data = [{
                id: 1,
                first_name: "Paul",
                last_name: "Lee",
                name: "Paul Lee",
                dob: "1990-04-18T00:00:00.000-04:00",
                dln: "L0001234567",
                passport_id: "P<USAGUPTA<<RAHUL<RAM<<<<<<<<<<<<<<<<<<311958554USA1234567M1234567890123456<123456"
            }];
            success(data);
        }
    },
    fetchSchedules: function(options, success, error) {
        if (AppConf.env == 'rest') {
            net.post({
                url: AppConf.host + 'api/visits.json',
                dataType: 'JSON',
                contentType: 'application/json',
                data: JSON.stringify(options.data),
                success: success,
                error: error
            });
        } else if (AppConf.env == 'test') {
            data = [{
                name: "Tianyu Huang",
                visit_date: "2015-03-19T14:49:00.113-04:00",
                visit_start_time: "2015-03-19T14:49:00.113-04:00",
                visit_end_time: "2015-03-19T16:49:00.113-04:00",
                visitor: {
                    id: 1,
                    first_name: "Tianyu",
                    last_name: "Huang",
                    name: "Tianyu Huang"
                },
                tenant: {
                    id: 8300,
                    name: "Music Studios Inc.",
                    secondary_address: "Suite 300"
                }
            }, {
                name: "Travis Sinnott",
                visit_date: "2015-03-24T14:49:00.113-04:00",
                visit_start_time: "2015-03-24T14:49:00.113-04:00",
                visit_end_time: "2015-03-24T16:49:00.113-04:00",
                visitor: {
                    id: 2,
                    first_name: "Travis",
                    last_name: "Sinnott",
                    name: "Travis Sinnott"
                },
                tenant: {
                    id: 3802,
                    name: "Building Intelligence Inc.",
                    secondary_address: "Suite 2015"
                }
            }, {
                name: "Jeff Friedman",
                visit_date: "2015-03-19T14:49:00.113-04:00",
                visit_start_time: "2015-03-19T14:49:00.113-04:00",
                visit_end_time: "2015-03-19T16:49:00.113-04:00",
                visitor: {
                    id: 3,
                    first_name: "Jeff",
                    last_name: "Friedman",
                    name: "Jeff Friedman"
                },
                tenant: {
                    id: 3802,
                    name: "Building Intelligence Inc.",
                    secondary_address: "Suite 2015"
                }
            }];
            success(data);
        }
    },
    fetchTenants: function(options, success, error) {
        if (AppConf.env == 'rest') {
            net.get({
                url: AppConf.host + 'api/directory.json?q=' + options.query,
                success: function(data, textStatus, jqXHR) {
                    success(data, textStatus, jqXHR);
                },
                error: function(data, textStatus) {
                    error(data, textStatus);
                }
            });
        } else if (AppConf.env == 'test') {
            data = [{
                "id": 123,
                "last_name": "Huang",
                "first_name": "Tianyu",
                "name": "Tianyu Huang",
                "phone_number": "1231231234",
                "phone_extension": "1234",
                "company_id": 8360,
                "company_name": "Building Intelligence ",
                "locations": ["Suite 400"]
            }, {
                "id": 123,
                "last_name": "Huang",
                "first_name": "Tianyu",
                "name": "Tianyu Huang",
                "phone_number": "1231231234",
                "phone_extension": "1234",
                "company_id": 8298,
                "company_name": "City Towers",
                "locations": ["Suite 200"]
            }];
            success(data);
        }
    },
    scheduleVisit: function(options, success, error) {
        if (AppConf.env == 'rest') {} else if (AppConf.env == 'test') {
            net.post({
                url: AppConf.host + 'events/new.json',
                dataType: 'JSON',
                contentType: 'application/json',
                data: JSON.stringify(options.data),
                success: success,
                error: error
            });
        }
    }
};