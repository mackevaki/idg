$(document).ready(function() {
    "use strict";
    $('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');
    $('.menu > ul > li > ul:not(:has(ul))').addClass('normal-sub');
    $(".menu > ul").before("<a href=\"#\" class=\"menu-mobile\">&nbsp;</a>");
    $(".menu > ul > li").hover(function(e) {
        if ($(window).width() > 943) {
            $(this).children("ul").stop(true, false).fadeToggle(150);
            e.preventDefault();
        }
    });
    $(".menu > ul > li").click(function() {
        if ($(window).width() <= 943) {
            $(this).children("ul").fadeToggle(150);
        }
    });
    $(".menu-mobile").click(function(e) {
        $(".menu > ul").toggleClass('show-on-mobile');
        e.preventDefault();
    });
});
$(window).resize(function() {
    $(".menu > ul > li").children("ul").hide();
    $(".menu > ul").removeClass('show-on-mobile');
});

let trunc_csv_path = "";
let sma_csv_path = "";


function showElement(elementId){
    var el = document.getElementById(elementId);
    el.style.display = "block";
};
function hideElement(elementId){
    var el = document.getElementById(elementId);
    el.style.display = "none";
};
// function tuggle_number_picker(elm){
//     var picker = document.getElementById("number-picker-block");
//     var aggfun = document.getElementById("function-block");
//     if (elm.value == "spectr"){
//         picker.style.display = "none";
//         aggfun.style.display = "none";
//     }else{
//         picker.style.display = "block";
//         aggfun.style.display = "block";
//     };
//
// };

function create_plot(){
    // show_loader();
    // hide_sma();
    showElement("loader");
    hideElement("sma");
    hideElement("download_box");
    var frame = document.getElementById("plotframe");
    frame.style.display = "none";
    // var system = document.getElementById("system").value;
    var date_from = document.getElementById("date_from").value;
    var date_to = document.getElementById("date_to").value;
    // var gr_min = document.getElementById("number-picker").value;
    // var fun = document.getElementById("function").value;
    $.post( "/electrovert", {
        // "system": system,
        "date_from": date_from,
        "date_to": date_to,
        "act": "create_plot"
        // "gr_min": gr_min,
        // "function": fun
    }, function(data) {
        var filename = data["plt_path"];
        trunc_csv_path = data["csv_path"];
        var frame = document.getElementById("plotframe");
        frame.src = `/plots/${filename}`;
        frame.style.display = "block";
        hideElement("loader");
        showElement("sma");
        showElement("download_box");
        hideElement("sma_csv");
    });
};

function sma_plot() {
    showElement("loader");
    var frame = document.getElementById("plotframe");
    frame.style.display = "none";
    var plt_path = frame.src;

    $.post( "/electrovert", {
        // "system": system,
        "csv_path": trunc_csv_path,
        "plt_path": frame.src,
        "act": "sma_plot"
        // "gr_min": gr_min,
        // "function": fun
    }, function(data) {
        sma_csv_path = data["csv_path"];
        var frame = document.getElementById("plotframe");
        frame.src = plt_path;
        hideElement("loader");
        showElement("sma_csv");
        frame.style.display = "block";
    });

};


function download_trunc() {
    // var arrayChecked = [];
    // $.each($("input[name='columns']:checked"), function(){
    //     arrayChecked.push($(this).val());
    // });
    var I1 = document.getElementById("I1").checked;
    var I2 = document.getElementById("I2").checked;
    $.post("/electrovert/download_trunc",
        {"csv_path": trunc_csv_path,
            "I1": I1,
            "I2": I2
        },
        function(data){
            window.location = `/plots/${data["filename"]}`;
        });

};

function download_sma() {
    window.location = `/plots/${sma_csv_path}`;
};

