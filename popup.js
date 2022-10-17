var _CONTENT = "/content/";
var _HTML = ".html";
var _PUBLISHED = "?wcmmode=disabled";
var _EDITOR = "/editor.html"
var _LIBS_TRUE = "?libs=true"

//loop through dev and prod locale patterns
function localesInit(pageUrl) {
    $.getJSON('data.json', function(data) {
        var locales = data.locales;
        var devLocales = data.devLocales;
        localeLinksGenerate(pageUrl, locales);
        localeLinksGenerate(pageUrl, devLocales);

        //show message when no locales in url
        let localeLinks = $('.locale-btn').length;
        if(localeLinks < 1) {
            $('#locales').append("<p class='no-pattern-text' >No patterns available</p>");
        }
    });
}

//generate locale links
function localeLinksGenerate(pageUrl, locales) {
    $.each(locales, function() {
        let _locale = this;
        let _slashed = "/"+_locale+"/";
        if(pageUrl.includes(_slashed)) {
            let toLocales = $.grep(locales, function(value) {
                return value != _locale;
            });
            console.log("page locale: ", _locale);
            $.each(toLocales, function() {
                let _thisSlashed = "/"+this+"/";
                let localePath = pageUrl.replace(_slashed, _thisSlashed);
                $('.locales').append("<div class='locale-btn'><a class='locale-btn-link' href='"+localePath+"' target='_blank'>"+this+"</a></div>");
            })
        }
    })
}

//generate links which includes 'content' in it
function contentLinksGenerate(pageUrl) {
    var pathname = new URL(pageUrl).pathname;
    var searchParams = new URL(pageUrl).search;
    var plainUrl = pageUrl.replace(searchParams, "");

    if( pathname.includes(_CONTENT) && pathname.endsWith(_HTML)) {

        //editor mode active
        if(pathname.includes(_EDITOR+"/")) {
            var pathName = pathname.replace(_EDITOR, "");
            var ePublishUrl = plainUrl.replace(pathname, pathName+_PUBLISHED);
            var eLibsUrl = plainUrl.replace(pathname, pathName+_LIBS_TRUE);
            $('.util-links').append("<a class='utils-btn' href='"+ePublishUrl+"' target='_blank'>Published</a>");
            $('.util-links').append("<a class='utils-btn' href='"+eLibsUrl+"' target='_blank'>Libs: true</a>");
        }

        //non-editor mode
        else {
            var editorUrl = plainUrl.replace(pathname, _EDITOR+pathname);
            $('.util-links').append("<a class='utils-btn' href='"+editorUrl+"' target='_blank'>Editor</a>");

            if(!searchParams.includes(_PUBLISHED)) {
                var publishUrl = plainUrl.replace(pathname, pathname+_PUBLISHED);
                $('.util-links').append("<a class='utils-btn' href='"+publishUrl+"' target='_blank'>Published</a>");
            }
            if(!searchParams.includes(_LIBS_TRUE)) {
                var libsUrl = plainUrl.replace(pathname, pathname+_LIBS_TRUE);
                $('.util-links').append("<a class='utils-btn' href='"+libsUrl+"' target='_blank'>Libs: true</a>");
            }
        }
    }

    //hide tab when url doesn't include 'content'
    let utilLinks = $('.utils-btn').length;
    if(utilLinks < 1) {
        $('#aem').hide();
        $('#aem-tab').hide();
    }
}

// triggers when doc ready
$(document).ready(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        console.log(url);
        localesInit(url);
        contentLinksGenerate(url);
    });
})

//tabs switching
const tabs = $('[data-tab-target]');
const tabContents = $('[data-tab-content]');

tabs.click(function(){
    tabs.removeClass("active");
    tabContents.removeClass("active");
    $(this).addClass("active");
    $(this.dataset.tabTarget).addClass("active");
})