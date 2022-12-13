/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4722222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://lifecharger.eu/-14"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/contact/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/-15"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-16"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-17"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/-10"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/contact/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/contact/-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/contact/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-12"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-18"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/blog/-7"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/blog/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/blog/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/blog/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/about/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/contact/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/about/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/contact/-6"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/about/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/contact/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/contact/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/about/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/contact/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/about/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/"], "isController": false}, {"data": [0.25, 500, 1500, "https://lifecharger.eu/contact/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/contact/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/about/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/contact/-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/about/-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://lifecharger.eu/contact/-1"], "isController": false}, {"data": [0.25, 500, 1500, "https://lifecharger.eu/contact/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/blog/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/contact/"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/-21"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/-22"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-23"], "isController": false}, {"data": [0.5, 500, 1500, "https://lifecharger.eu/-20"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/about/"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/blog/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://lifecharger.eu/blog/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://lifecharger.eu/blog/-10"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 71, 0, 0.0, 1795.478873239436, 95, 20941, 1159.0, 3412.599999999999, 5603.4, 20941.0, 0.7154877913597292, 51.85606610515151, 0.813731555404956], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://lifecharger.eu/-14", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 51.78430838178294, 2.3240673449612403], "isController": false}, {"data": ["https://lifecharger.eu/contact/-13", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.9731570512820513, 3.1901041666666665], "isController": false}, {"data": ["https://lifecharger.eu/-15", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 29.737087111398964, 3.046065414507772], "isController": false}, {"data": ["https://lifecharger.eu/-16", 1, 0, 0.0, 1731.0, 1731, 1731, 1731.0, 1731.0, 1731.0, 1731.0, 0.5777007510109763, 24.210964579722702, 0.30577520219526283], "isController": false}, {"data": ["https://lifecharger.eu/about/-11", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 2.0250822368421053, 3.2637746710526314], "isController": false}, {"data": ["https://lifecharger.eu/-17", 1, 0, 0.0, 1058.0, 1058, 1058, 1058.0, 1058.0, 1058.0, 1058.0, 0.945179584120983, 85.50736944706993, 0.5039727079395084], "isController": false}, {"data": ["https://lifecharger.eu/about/-10", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 40.09046052631579, 6.126644736842105], "isController": false}, {"data": ["https://lifecharger.eu/-10", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 53.332177278037385, 2.4961667640186915], "isController": false}, {"data": ["https://lifecharger.eu/-11", 1, 0, 0.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 97.17373260961214, 0.5640348334738617], "isController": false}, {"data": ["https://lifecharger.eu/contact/-10", 1, 0, 0.0, 3481.0, 3481, 3481, 3481.0, 3481.0, 3481.0, 3481.0, 0.2872737719046251, 50.191833794168346, 0.5052539679689745], "isController": false}, {"data": ["https://lifecharger.eu/-12", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 106.87592273622047, 1.5455831692913387], "isController": false}, {"data": ["https://lifecharger.eu/contact/-11", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 36.62109375, 5.126953125], "isController": false}, {"data": ["https://lifecharger.eu/-13", 1, 0, 0.0, 1417.0, 1417, 1417, 1417.0, 1417.0, 1417.0, 1417.0, 0.7057163020465773, 78.56882939308397, 0.42797834333098095], "isController": false}, {"data": ["https://lifecharger.eu/contact/-12", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.9936042746113989, 3.2130424222797926], "isController": false}, {"data": ["https://lifecharger.eu/about/-12", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 2.046625664893617, 3.3088846409574466], "isController": false}, {"data": ["Test", 1, 0, 0.0, 35428.0, 35428, 35428, 35428.0, 35428.0, 35428.0, 35428.0, 0.02822626171389861, 70.15799980770859, 1.1147995141554703], "isController": true}, {"data": ["https://lifecharger.eu/-18", 1, 0, 0.0, 1067.0, 1067, 1067, 1067.0, 1067.0, 1067.0, 1067.0, 0.9372071227741331, 97.77614661433927, 0.49880652530459235], "isController": false}, {"data": ["https://lifecharger.eu/-19", 1, 0, 0.0, 5567.0, 5567, 5567, 5567.0, 5567.0, 5567.0, 5567.0, 0.17962996227770792, 125.76605863795581, 0.09402505837973774], "isController": false}, {"data": ["https://lifecharger.eu/blog/-7", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 2.040963955026455, 3.2397073412698414], "isController": false}, {"data": ["https://lifecharger.eu/blog/-6", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 18.095631843065693, 0.9181113138686131], "isController": false}, {"data": ["https://lifecharger.eu/blog/-5", 1, 0, 0.0, 2947.0, 2947, 2947, 2947.0, 2947.0, 2947.0, 2947.0, 0.33932813030200204, 0.1391775534441805, 0.20876633016627077], "isController": false}, {"data": ["https://lifecharger.eu/blog/-4", 1, 0, 0.0, 3139.0, 3139, 3139, 3139.0, 3139.0, 3139.0, 3139.0, 0.31857279388340237, 0.1303535162472125, 0.20097463364128704], "isController": false}, {"data": ["https://lifecharger.eu/blog/-9", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.5442195197044335, 3.53582974137931], "isController": false}, {"data": ["https://lifecharger.eu/blog/-8", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 2.0039876302083335, 3.2246907552083335], "isController": false}, {"data": ["https://lifecharger.eu/about/-8", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 2.0686323924731185, 3.3287130376344085], "isController": false}, {"data": ["https://lifecharger.eu/about/-7", 1, 0, 0.0, 2125.0, 2125, 2125, 2125.0, 2125.0, 2125.0, 2125.0, 0.47058823529411764, 0.19347426470588236, 0.2881433823529412], "isController": false}, {"data": ["https://lifecharger.eu/about/-9", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.551864170792079, 3.553333849009901], "isController": false}, {"data": ["https://lifecharger.eu/contact/-7", 1, 0, 0.0, 2493.0, 2493, 2493, 2493.0, 2493.0, 2493.0, 2493.0, 0.40112314480545525, 0.1649148866827116, 0.24560958182912154], "isController": false}, {"data": ["https://lifecharger.eu/about/-4", 1, 0, 0.0, 2035.0, 2035, 2035, 2035.0, 2035.0, 2035.0, 2035.0, 0.4914004914004914, 0.2010710995085995, 0.31000460687960685], "isController": false}, {"data": ["https://lifecharger.eu/contact/-6", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 79.45838341346153, 4.03145032051282], "isController": false}, {"data": ["https://lifecharger.eu/about/-3", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 0.3515961455641688, 0.5240296619293712], "isController": false}, {"data": ["https://lifecharger.eu/contact/-9", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5595848880597014, 3.5710121268656714], "isController": false}, {"data": ["https://lifecharger.eu/about/-6", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 120.34473604368932, 6.105885922330097], "isController": false}, {"data": ["https://lifecharger.eu/contact/-8", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 2.0250822368421053, 3.2586348684210527], "isController": false}, {"data": ["https://lifecharger.eu/about/-5", 1, 0, 0.0, 1800.0, 1800, 1800, 1800.0, 1800.0, 1800.0, 1800.0, 0.5555555555555556, 0.22786458333333331, 0.341796875], "isController": false}, {"data": ["https://lifecharger.eu/contact/-3", 1, 0, 0.0, 2209.0, 2209, 2209, 2209.0, 2209.0, 2209.0, 2209.0, 0.4526935264825713, 0.18479091217745586, 0.27541803417836125], "isController": false}, {"data": ["https://lifecharger.eu/about/-0", 1, 0, 0.0, 1845.0, 1845, 1845, 1845.0, 1845.0, 1845.0, 1845.0, 0.5420054200542005, 74.14147188346884, 0.2646510840108401], "isController": false}, {"data": ["https://lifecharger.eu/", 1, 0, 0.0, 20941.0, 20941, 20941, 20941.0, 20941.0, 20941.0, 20941.0, 0.04775321140346688, 93.73321176161598, 0.6449947919153813], "isController": false}, {"data": ["https://lifecharger.eu/contact/-2", 2, 0, 0.0, 1806.0, 938, 2674, 1806.0, 2674.0, 2674.0, 2674.0, 0.48042277203939465, 41.070751636440065, 0.2948688595964449], "isController": false}, {"data": ["https://lifecharger.eu/contact/-5", 1, 0, 0.0, 2303.0, 2303, 2303, 2303.0, 2303.0, 2303.0, 2303.0, 0.43421623968736434, 0.17809650455927054, 0.26714475683890576], "isController": false}, {"data": ["https://lifecharger.eu/blog/", 1, 0, 0.0, 4707.0, 4707, 4707, 4707.0, 4707.0, 4707.0, 4707.0, 0.21244954323348203, 20.41694052740599, 1.7159864961759084], "isController": false}, {"data": ["https://lifecharger.eu/about/-2", 1, 0, 0.0, 2052.0, 2052, 2052, 2052.0, 2052.0, 2052.0, 2052.0, 0.4873294346978557, 0.20035712110136453, 0.30458089668615984], "isController": false}, {"data": ["https://lifecharger.eu/contact/-4", 1, 0, 0.0, 1449.0, 1449, 1449, 1449.0, 1449.0, 1449.0, 1449.0, 0.6901311249137336, 0.28238763802622496, 0.43537569013112487], "isController": false}, {"data": ["https://lifecharger.eu/about/-1", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.5291539634146343, 3.558498475609756], "isController": false}, {"data": ["https://lifecharger.eu/contact/-1", 2, 0, 0.0, 621.0, 284, 958, 621.0, 958.0, 958.0, 958.0, 0.6203473945409429, 1.0986328125, 0.4040739376550868], "isController": false}, {"data": ["https://lifecharger.eu/contact/-0", 2, 0, 0.0, 1524.0, 1469, 1579, 1524.0, 1579.0, 1579.0, 1579.0, 0.5324813631522897, 20.21609175319489, 0.28574073149627266], "isController": false}, {"data": ["https://lifecharger.eu/blog/-3", 1, 0, 0.0, 2468.0, 2468, 2468, 2468.0, 2468.0, 2468.0, 2468.0, 0.4051863857374392, 0.16539834886547813, 0.24651476397893032], "isController": false}, {"data": ["https://lifecharger.eu/blog/-2", 1, 0, 0.0, 2688.0, 2688, 2688, 2688.0, 2688.0, 2688.0, 2688.0, 0.3720238095238095, 0.15295119512648808, 0.23251488095238093], "isController": false}, {"data": ["https://lifecharger.eu/blog/-1", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2390377964426877, 2.883368330039526], "isController": false}, {"data": ["https://lifecharger.eu/blog/-0", 1, 0, 0.0, 1537.0, 1537, 1537, 1537.0, 1537.0, 1537.0, 1537.0, 0.6506180871828238, 46.95505652244633, 0.3170492436564737], "isController": false}, {"data": ["https://lifecharger.eu/-0", 1, 0, 0.0, 11549.0, 11549, 11549, 11549.0, 11549.0, 11549.0, 11549.0, 0.08658758334054896, 15.57781653173435, 0.0417717443068664], "isController": false}, {"data": ["https://lifecharger.eu/-8", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 7.284931752873564, 0.7604840158045978], "isController": false}, {"data": ["https://lifecharger.eu/-7", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 51.93014705882353, 1.4085477941176472], "isController": false}, {"data": ["https://lifecharger.eu/-6", 1, 0, 0.0, 1848.0, 1848, 1848, 1848.0, 1848.0, 1848.0, 1848.0, 0.5411255411255411, 6.7075258725649345, 0.31389508928571425], "isController": false}, {"data": ["https://lifecharger.eu/-5", 1, 0, 0.0, 1974.0, 1974, 1974, 1974.0, 1974.0, 1974.0, 1974.0, 0.5065856129685917, 4.661676006838906, 0.2686288943768997], "isController": false}, {"data": ["https://lifecharger.eu/-4", 1, 0, 0.0, 1884.0, 1884, 1884, 1884.0, 1884.0, 1884.0, 1884.0, 0.5307855626326964, 1.6296775477707006, 0.29027335456475584], "isController": false}, {"data": ["https://lifecharger.eu/-3", 1, 0, 0.0, 2490.0, 2490, 2490, 2490.0, 2490.0, 2490.0, 2490.0, 0.40160642570281124, 0.2690449297188755, 0.21100025100401604], "isController": false}, {"data": ["https://lifecharger.eu/-2", 1, 0, 0.0, 2724.0, 2724, 2724, 2724.0, 2724.0, 2724.0, 2724.0, 0.36710719530102787, 34.18793307176946, 0.19789372246696033], "isController": false}, {"data": ["https://lifecharger.eu/-1", 1, 0, 0.0, 2621.0, 2621, 2621, 2621.0, 2621.0, 2621.0, 2621.0, 0.38153376573826786, 98.3261696394506, 0.25969632296833267], "isController": false}, {"data": ["https://lifecharger.eu/contact/", 1, 0, 0.0, 5658.0, 5658, 5658, 5658.0, 5658.0, 5658.0, 5658.0, 0.17674089784376104, 47.677928375751144, 1.7340974615588547], "isController": false}, {"data": ["https://lifecharger.eu/-9", 1, 0, 0.0, 832.0, 832, 832, 832.0, 832.0, 832.0, 832.0, 1.201923076923077, 105.81148587740385, 0.6326528695913461], "isController": false}, {"data": ["https://lifecharger.eu/-21", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 29.754638671875, 5.13458251953125], "isController": false}, {"data": ["https://lifecharger.eu/-22", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 19.89233193277311, 2.2485556722689077], "isController": false}, {"data": ["https://lifecharger.eu/-23", 1, 0, 0.0, 1159.0, 1159, 1159, 1159.0, 1159.0, 1159.0, 1159.0, 0.8628127696289906, 5.676532840811044, 0.46342482743744606], "isController": false}, {"data": ["https://lifecharger.eu/-20", 1, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 1.221001221001221, 51.07099931318682, 0.6522340506715507], "isController": false}, {"data": ["https://lifecharger.eu/about/", 1, 0, 0.0, 4122.0, 4122, 4122, 4122.0, 4122.0, 4122.0, 4122.0, 0.242600679281902, 38.04613582605531, 1.9649707362930617], "isController": false}, {"data": ["https://lifecharger.eu/blog/-12", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 2.0144797120418847, 3.2569126308900525], "isController": false}, {"data": ["https://lifecharger.eu/blog/-11", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.9432607323232323, 3.131904987373737], "isController": false}, {"data": ["https://lifecharger.eu/blog/-10", 1, 0, 0.0, 1839.0, 1839, 1839, 1839.0, 1839.0, 1839.0, 1839.0, 0.543773790103317, 4.204157320554649, 0.30481069874932026], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 71, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
