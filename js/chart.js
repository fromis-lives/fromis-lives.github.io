const memberNames = ["saerom", "hayoung", "gyuri", "jiwon", "jisun", "seoyeon", "chaeyoung", "nagyung", "jiheon"];
const memberColors = ["navy", "yellow", "white", "orange", "brown", "red", "purple", "pink", "aquamarine", "goldenrod", "fuchsia"];

var chart = null;
var selectedPath = null;
var memberToValue = null;
var hapbangValue = null;
var multipleValue = null;

function getViewDiv(elemData, divClass) {
    var text = "<div class='" + divClass + "'>"
    if (elemData["thumbnail"]) {
        tPath = elemData["thumbnail"][0];
        tWidth = elemData["thumbnail"][1];
        tHeight = elemData["thumbnail"][2];
        text += "<div align='center'><img src='" + tPath + "' ";
        text += "width='" + tWidth + "' height='" + tHeight + "'/></div>";
    }
    text += "<div class='fields_container'>";
    var firstField = true;
    for (const [j, [key, value]] of Object.entries(Object.entries(elemData))) {
        if (key == "thumbnail" || key == "account" || key == "titlekr") {
            continue;
        }
        if (locale == "kr" && (key == "subbed" || key == "sublink")) {
            continue;
        }
        if (firstField) {
            firstField = false;
        } else {
            text += "<br>";
        }
        i18key = "field_" + key.replace(/ /g, "_");
        cKey = key.charAt(0).toUpperCase() + key.slice(1);
        i18val = translateKey(i18key);
        keySpan = '<span data-i18n-key="' + i18key + '">' + i18val + "</span>";
        text += keySpan + "<span>: </span>";
        if (key == "title") {
            if (locale == "kr" && elemData["titlekr"]) {
                text += '<span>' + elemData["titlekr"] + '</span>';
            } else {
                text += '<span>' + value + '</span>';
            }
        } else if (key == "link" || key == "sublink") {
            var hostname = new URL(value).hostname;
            hostname = hostname.replace('www.', '');
            hostname = hostname.replace('.com', '');
            hostname = hostname.replace('.io', '');
            hostname = hostname.charAt(0).toUpperCase() + hostname.slice(1);

            text += "<a class='out_link' target='_blank' href='" + value + "'>" + hostname + "</a>";
        } else if (key == "members" || key == "people") {
            for (let i = 0; i < value.length; ++i) {
                if (i > 0) {
                    text += "<span>, </span>";
                }
                text += '<span data-i18n-key="' + value[i] + '">' + translateKey(value[i]) + "</span>";
            }
        } else if (key == "platform") {
            text += '<span data-i18n-key="' + value + '">' + translateKey(value) + "</span>";
            if (elemData["account"]) {
                const account = elemData["account"];
                text += "<span> (</span>";
                text += '<span data-i18n-key="' + account + '">' + translateKey(account) + "</span><span>)</span>";
            }
        } else {
            text += '<span>' + value + '</span>';
        }
    }
    text += "</div></div>"
    return text;
}

function buildChart() {
    if (chart) {
        return;
    }

    memberToValue = {};
    for (let i = 0; i < memberNames.length; ++i) {
        memberToValue[memberNames[i]] = (1 << i);
    }
    hapbangValue = (1 << (memberNames.length - 1)) + 1;
    multipleValue = hapbangValue + 1;

    var rangesArray = [];
    var colorsArray = [];
    for (let i = 0; i < memberNames.length; i++) {
        rangesArray.push({ equal: memberToValue[memberNames[i]] });
    }
    rangesArray.push({ equal: hapbangValue });
    rangesArray.push({ equal: multipleValue });
    colorsArray = memberColors;
    const customColorScale = anychart.scales.ordinalColor();
    customColorScale.ranges(rangesArray);
    customColorScale.colors(colorsArray);

    chart = anychart.calendar();
    chart.contextMenu(false);
    chart.background("#22282D");
    chart.colorScale(customColorScale);
    chart.colorRange(false)

    chart.months()
        .stroke("#474747")
        .noDataStroke("#474747");
    chart.days()
        .spacing(4)
        .stroke(false)
        .noDataStroke(false)
        .noDataFill("#2d333b")
        .noDataHatchFill(false)
        .hovered()
        .fill({ color: "black", opacity: 0.3 })
        .stroke({ color: '#dfdfdf', thickness: 2 });

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        chart.tooltip(false);
    } else {
        chart.tooltip().allowLeaveStage(true).position("left-top").useHtml(true).format(function () {
            var text = "";
            text += "<div class='info_tooltip'>";
            for (let i = 0; i < this.getData("elems").length; i++) {
                if (i > 0) {
                    text += "<hr noshade='true' class='anychart-tooltip-separator'>"
                }
                text += getViewDiv(this.getData("elems")[i], "tooltip_elem")
            }
            text += "</div>"
            return text;
        });
    }

    chart.listen("pointClick", function (e) {
        if (selectedPath != null) {
            selectedPath.setAttribute("stroke", "none");
        }
        const row = chart.data().row(e.dataIndex);
        const elemId = e.originalEvent.getOriginalEvent().target.he
        selectedPath = document.getElementById(elemId);
        selectedPath.setAttribute("stroke", "#dfdfdf");
        selectedPath.setAttribute("stroke-width", "2");

        dateString = row['x'];
        var elemDate = document.getElementById("elem_date");
        elemDate.innerHTML = dateString;

        const elems = row["elems"];
        var htmlContent = '';
        for (let i = 0; i < elems.length; i++) {
            htmlContent += getViewDiv(elems[i], "info_elem");
        }
        document.getElementById("sep_before_info").style.visibility = 'visible';
        document.getElementById("elem_info_container").innerHTML = htmlContent;
    });

    chart.listen("chartDraw", function () {
        document.getElementById("container").style.height = (chart.getActualHeight() + 20) + "px";
        credits = document.querySelector(".anychart-credits");
        if (credits) {
            credits.remove();
        }
    });
    chart.container("container");
}

function updateChart() {
    if (selectedPath != null) {
        selectedPath.setAttribute("stroke", "none");
        selectedPath = null;
    }

    const memberCheckboxes = document.querySelectorAll('.member_check:checked');
    const selectedMembers = [...memberCheckboxes].map(e => (e.getAttribute('value').toLowerCase()));
    const membershipCheckboxes = document.querySelectorAll('.membership_check:checked');
    const selectedMembership = [...membershipCheckboxes].map(e => (e.getAttribute('value')));
    const subsCheckboxes = document.querySelectorAll('.subs_check:checked');
    const selectedSubs = [...subsCheckboxes].map(e => (e.getAttribute('value')));

    var data = [];
    for (const [date, row] of Object.entries(fullData)) {
        var goodElems = row.filter(elem => {
            if (elem["subbed"] == "Yes") {
                if (!selectedSubs.includes("Yes")) {
                    return false;
                }
            } else {
                if (!selectedSubs.includes("No")) {
                    return false;
                }
            }
            if (elem["membership"] == "Yes") {
                if (!selectedMembership.includes("Yes")) {
                    return false;
                }
            } else {
                if (!selectedMembership.includes("No")) {
                    return false;
                }
            }
            if (selectedMembers.length > 0 && elem["members"].includes("all")) {
                if (selectedMembers.length > 1 || selectedMembers[0] != "gyuri" || date < "2022-07-31") {
                    return true;
                }
            }
            for (let mem of elem["members"]) {
                if (selectedMembers.includes(mem)) {
                    return true;
                }
            }
            return false;
        });
        if (goodElems.length == 0) {
            continue;
        }
        var rowValue = 0;
        if (goodElems.length > 1) {
            rowValue = multipleValue;
        } else if (goodElems[0]["members"].length > 1 || goodElems[0]["people"] || goodElems[0]["members"][0] == "all") {
            rowValue = hapbangValue;
        } else {
            rowValue = memberToValue[goodElems[0]["members"][0]];
        }
        data.push({
            x: date,
            value: rowValue,
            elems: goodElems,
        });
    }

    chart.data(data);
    chart.draw();

    const elemDate = document.getElementById("elem_date").innerHTML = '';
    document.getElementById("elem_info_container").innerHTML = '';
    document.getElementById("sep_before_info").style.visibility = 'hidden';
}

function modifyBoxIfNeeded(urlParams, field) {
    const checkStatus = urlParams.get(field);
    if (checkStatus != null) {
        document.getElementById(field + '_box').checked = (checkStatus === 'true');
    }
}

function toggleFilter() {
    const filterDiv = document.getElementById('filter_container');
    filterDiv.classList.toggle('hidden');
}

function hideFilter() {
    const filterDiv = document.getElementById('filter_container');
    if (!filterDiv.classList.contains('hidden')) filterDiv.classList.add('hidden');
}

anychart.onDocumentReady(function () {
    initializeUserLocale();
    document.getElementById("last_updated").innerHTML = updateDate;

    const titleLetters = document.querySelectorAll('.title_letter');
    for (let i = 0; i < titleLetters.length; ++i) {
        titleLetters[i].style.setProperty('color', memberColors[i]);
    }
    const memberCheckboxes = document.querySelectorAll('.member_check');
    for (let i = 0; i < memberCheckboxes.length; ++i) {
        memberCheckboxes[i].style.setProperty('accent-color', memberColors[i]);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    modifyBoxIfNeeded(urlParams, 'link_public');
    modifyBoxIfNeeded(urlParams, 'link_private');
    modifyBoxIfNeeded(urlParams, 'link_missing');

    buildChart();
    updateChart();
    document.getElementsByTagName("html")[0].style.visibility = "visible";
    const cchart = document.getElementById("container_chart");
    cchart.classList.add('containerScroll');
});
