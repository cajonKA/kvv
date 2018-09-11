var app = angular.module('kvvApp', ['ui.bootstrap', 'ngCookies']);
app.controller('kvvCtrl', function ($scope, $http, $interval, $cookies, $location) {

    // Config
    cookieExp = new Date();
    cookieExp.setDate(cookieExp.getDate() + 14);            // Cookie expires after 14 days
    getconfig = $location.search();                         // get Params from URL
    config = $cookies.getObject('config');                  // get Params from Cookie
    
    if (!config) {                              // Set Default Settings if neither Cookie nor URL Params are set
        config = {};
        config.stopName = "de:8212:525";     	// Default Haltestelle Siemensallee 84
        config.route = "2";                 	// Default Bahnlinie
        config.dir = "1";                  	// hier die Fahrtrichtung eintragen oder leerlasse für beide Richtungen
        $cookies.putObject('config', config, {'expires': cookieExp});
    }
    for (var key in getconfig) {                            // replace Cookie Settings with params from URL
        config[key] = getconfig[key];
    }
    // Ende Config
    
    kvv = this;
    kvv.dir = config.dir;
    kvv.route = config.route;
    kvv.trainSelect = [];
    angular.forEach(config.route.split(","), function (linie) {
        kvv.trainSelect.push(linie);
    })
    kvv.trainSelect.push(config.route);
    kvv.stop = {};

    this.getTimeTable = function () {
        $http.get("kvv.php?stop=" + config.stopName)
                .success(function (data) {
                    kvv.stop = data;
                    kvv.filterTimeTable(kvv.stop)
                })
                .error(function (data) {
                    console.debug("ERROR");
                    console.debug(data);
                });
        this.route = (config.route == "") ? "Alle Linien" : "Linie " + config.route;
    };
    this.getTimeTable();
    $interval(this.getTimeTable, 60000);
    this.getStop = function (val) {
        return $http.get('stop.php', {
            params: {
                stop: val
            }
        }).then(function (response) {
            return response.data.stops.map(function (item) {
                return item;
            });
        });
    };
    this.selectStop = function ($item) {
        config.route = "";
        config.stopName = $item.id;
        $cookies.putObject('config', config, {'expires': cookieExp});
        this.getTimeTable();
    };
    this.setDir = function () {
        config.dir = kvv.dir;
        $cookies.putObject('config', config, {'expires': cookieExp});
        kvv.filterTimeTable(kvv.stop);
    };
    this.setTrain = function () {
        config.route = kvv.trainSelect.join();
        $cookies.putObject('config', config, {'expires': cookieExp});
        kvv.route = config.route;
        kvv.filterTimeTable(kvv.stop);
        this.route = (config.route == "") ? "Alle Linien" : "Linie " + config.route;
    };
    this.filterTimeTable = function (data) {
        kvv.trains = [];
        daten = JSON.parse(JSON.stringify(data));
        $scope.response = {stopName: "", departures: []};
        $scope.response.stopName = data.stopName;
        angular.forEach(daten.departures, function (bahn) {
            if (kvv.trains.indexOf(bahn.route) == -1)
                kvv.trains.push(bahn.route);    // add Train to Trainlist if not yet in it
            if ((kvv.trainSelect.indexOf(bahn.route) > -1 || kvv.route === "") && (bahn.direction === kvv.dir || kvv.dir === "")) {
                var zeit = "";
                if (bahn.time === "0")
                    bahn.time += " min";
                if (bahn.time.indexOf("min") < 0) {
                    var time2 = bahn.time.split(":");
                    var time = new Date();
                    time.setHours(time2[0]);
                    time.setMinutes(time2[1]);
                    var now = new Date();
                    var diff = new Date(time.getTime() - now.getTime());
                    var diffStr = (diff.getHours() + diff.getTimezoneOffset() / 60) * 60 + diff.getMinutes();
                    bahn.time = diffStr + " min";
                    bahn.mod = "font-weight:bold;";
                }
                else {
                    bahn.mod = "font-weight:bold;color:red";
                }
                bahn.time = (bahn.time === "0 min") ? " Sofort" : " in " + bahn.time;
                bahn.isReal = bahn.realtime ? "✓" : "✗";
                $scope.response.departures.push(bahn);
            }

        });
        kvv.trains.sort();
    };

});

