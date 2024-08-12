var locale = "kr";

const supportedLocales = ["en", "kr"];

const translations = {
    "en": {
        "last_updated": "Last updated",
        "members": "Members",
        "saerom": "Saerom",
        "hayoung": "Hayoung",
        "gyuri": "Gyuri",
        "jiwon": "Jiwon",
        "jisun": "Jisun",
        "seoyeon": "Seoyeon",
        "chaeyoung": "Chaeyoung",
        "nagyung": "Nagyung",
        "jiheon": "Jiheon",
        "all": "All",
        "hapbang": "Multiple Members",
        "multiple": "Multiple Lives",
        "membership_filter": "Membership",
        "membership_yes": "Yes",
        "membership_no": "No",
        "subs_filter": "Subs",
        "field_title": "Title",
        "field_members": "Members",
        "field_people": "People",
        "field_start_time": "Start time",
        "field_duration": "Duration",
        "field_platform": "Platform",
        "field_sublink": "Subbed link",
        "field_link": "Link",
        "field_subbed": "Subbed",
        "field_membership": "Membership",
        "true": "Yes",
        "false": "No",
        "weverse": "Weverse",
        "vlive": "VLIVE",
        "youtube": "YouTube",
        "instagram": "Instagram",
        "facebook": "Facebook",
        "twitter": "Twitter",
        "kakaotv": "KakaoTV",
        "showroom": "SHOWROOM",
        "huyatv": "HUYA TV",
        "huya tv": "HUYA TV",
        "hybe labels": "HYBE LABELS",
        "weekly idol": "Weekly Idol",
        "navernow": "Naver NOW",
        "radio": "Radio",
    },
    "kr": {
        "last_updated": "최근 수정일",
        "members": "멤버",
        "saerom": "이새롬",
        "hayoung": "송하영",
        "gyuri": "장규리",
        "jiwon": "박지원",
        "jisun": "노지선",
        "seoyeon": "이서연",
        "chaeyoung": "이채영",
        "nagyung": "이나경",
        "jiheon": "백지헌",
        "all": "정원",
        "hapbang": '합방/ft.',
        "multiple": "Multiple",
        "membership_filter": "멤버십",
        "membership_yes": "Yes",
        "membership_no": "No",
        "subs_filter": "Subs",
        "field_title": "제목",
        "field_members": "멤버",
        "field_people": "출연",
        "field_start_time": "시간",
        "field_duration": "기간",
        "field_platform": "플랫폼",
        "field_link": "링크",
        "field_membership": "멤버십",
        "weverse": "위버스",
        "vlive": "븨앱",
        "youtube": "유튜브",
        "instagram": "인스타그램",
        "facebook": "페이스북",
        "twitter": "트위터",
        "kakaotv": "카카오티비",
        "showroom": "쇼룸",
        "huyatv": "후야티비",
        "huya tv": "후야티비",
        "hybe labels": "HYBE LABELS",
        "weekly idol": "주간 아이돌",
        "navernow": "네이버 NOW",
        "radio": "라디오",
    }
};

function translateKey(key) {
    value = translations[locale][key.toString().toLowerCase()];
    if (!value) {
        console.log("Translation not found: " + locale + " - " + key);
        return key;
    }
    return value;
}

function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const translation = translateKey(key);
    element.innerText = translation;
}

function translatePage() {
    document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}

function changeLocale(loc) {
    locale = loc;
    document.querySelector("#lang_select_kr").classList.toggle("lang_select_on", (locale == "kr"));
    document.querySelector("#lang_select_kr").classList.toggle("lang_select_off", (locale != "kr"));
    document.querySelector("#lang_select_en").classList.toggle("lang_select_on", (locale == "en"));
    document.querySelector("#lang_select_en").classList.toggle("lang_select_off", (locale != "en"));
    translatePage();
}

function initializeUserLocale() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var userLocale = urlParams.get('locale');
    if (!userLocale) {
        locales = navigator.languages.map((loc) => loc.split("-")[0]);
        if (locales.length > 0 && supportedLocales.includes(locales[0])) {
            userLocale = locales[0];
        }
    }
    if (!userLocale) {
        userLocale = "en";
    }
    changeLocale(userLocale);
}

