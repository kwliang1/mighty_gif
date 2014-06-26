function appendGifButton(buttonDestination){

    var htmlStr = '<div class="gif-app-wrapper">';
    htmlStr += '<button class="gif-insert-button">Insert GIF</button>';
    htmlStr += '</div>';

/*
    var buttonRow = $("div.aDh");
    
    console.log(buttonRow);
    
    if(buttonRow["length"] > 0){
        $(buttonRow).each(function(){
    
            var buttonDestination = $(buttonRow).closest("td.HE").find("div.aDj");
*/
            
            $(buttonDestination).find(".gif-app-wrapper").remove()//remove any dups.
        
/*                 $(htmlStr).appendTo(buttonDestination).each(function(){ */

                $(htmlStr).insertAfter(buttonDestination).each(function(){                            
                    
                    var insertButton = $(this).find(".gif-insert-button");
                    
                    $(insertButton).on("click", function(){
                    
                        openFunnyImageGallery(this);
        
                });
                
            });
            
/*
        });    
    } else {
    
        setTimeout(appendGifButton, 1000);//if we can't find where to append this button, try again in 1 second 5/10/14 KL
    
    }
*/

}

function openFunnyImageGallery(buttonClicked){
    
    var galleryHTML = '<div class="gif-gallery-container">';
    galleryHTML += '<div class="gif-gallery-outer-wrapper">';
    galleryHTML += '<div class="gif-gallery-inner-wrapper">';

    galleryHTML += '</div>';  
    galleryHTML += '</div>';
    
    galleryHTML += '<div class="gif-gallery-remove-button">';
    galleryHTML += '<i class="fa fa-times-circle"></i>';
    galleryHTML += '</div>';  
    galleryHTML += '<div class="gif-gallery-backdrop">';
    galleryHTML += '</div>';    
    galleryHTML += '</div>';
    
    $(galleryHTML).appendTo("body").each(function(){
        
        setupRemoveButton();
        
        fetchGalleryContent(buttonClicked, this);
        
    });

}

function setupRemoveButton(){
    $(".gif-gallery-remove-button").on("click", function(){
        
        removeGallery();
        
    });
}

function removeGallery(){
    $(".gif-gallery-container").fadeOut(200, function(){
        $(this).remove();
        
        
        var test = $(".ae3 .l8.ou");
        
        console.log(test);
                
    });    
}

function insertImageIntoComposeBody(actionOrigin, imgChosen){
    var imgSRC = $(imgChosen).data("gifsource");
    var imgHTML = '<img src="" alt="mightyImage"/>';
//    var composeBody = $(actionOrigin).closest("div.aaZ").find("[contenteditable='true']");
//proposed method of finding the neart content editable div.  We could find the closest table row, to this actionorigin.  Then loop through it's siblings.  

    var composeBody = findNearestContentEditableDiv(actionOrigin);

    var galleryToRemove = $(actionOrigin).closest(".gif-gallery-container");
    
    console.log(composeBody);
    
    $(imgHTML).appendTo(composeBody).each(function(){
    
        $(this).attr("src", imgSRC);
        
        removeGallery(galleryToRemove);
        
/*         var divToScroll = $(composeBody).closest(".qz.aXjCH"); */
        var divToScroll = $(composeBody).closest(".Tm.aeJ");
/*         var topPosition = $("table.aoP.HM").offset().top; */
/*         var topPosition = $("div.gA.gt").offset().top - $(divToScroll).offset().top; */
        var topPosition = $("div.gA.gt").position().top - $(divToScroll).offset().top;
        
/*         var topPosition = getThePositionRelativeToTheScrollableDiv("div.gA.gt"); */

        
        console.log(divToScroll);
/*         console.log(topPosition); */
        
/*
        $(divToScroll).animate({ scrollTop: $(document).height() }, "slow", function(){
//            alert("hello");
        });
*/

        $(divToScroll).animate({
            scrollTop: topPosition
        }, "slow", function(){
//            alert("hello");
        });
        
    });
    
}

function findNearestContentEditableDiv(buttonClicked){
    
    var value = null;
    
    $(buttonClicked).closest("tr").siblings().each(function(){
        var nearestContentEditableDiv = $(this).find("[contenteditable='true']");
        
        if(nearestContentEditableDiv["length"] > 0){
            
            console.log({
                "message":"found the contenteditable",
                "obj_found": nearestContentEditableDiv
            });
            
            value = nearestContentEditableDiv;
            
        }   
         
    });
    
    return value;
    
}

function listenForWhenUserComposesNew(){

    $(window).on('hashchange', function() {
        var currentHashParams = window.location.hash;
        
        if(currentHashParams.indexOf("compose=new") > -1){
            appendGifButton();
        }    
    });

}

function checkIfUserIsInComposeNew(){
    var currentWindowURL = window.location.hash;

    var value;
    
    if(currentWindowURL.indexOf("compose=new") > -1){
        value = true;
    } else {
        value = false;
    }
    
    return value;
    
}

function initializeApp(){
/*
    var currentWindowURL = window.location.href;
    
    if(checkIfUserIsInComposeNew()){
        appendGifButton();
    }
    
    listenForWhenUserComposesNew()//listen for the window.onhashchange event to know if the user triggered a compose new after loading this page. KL 5/10/14
*/
    
    listenForChangesInGmailDom()//listen for when the send  button is appended into the DOM.
    
}

function fetchGalleryContent(origin, gallery){
/*
    galleryHTML += '<div class="gif-image-wrapper">';
    galleryHTML += '<img class="gif-image" src="https://mightytext.net/prod-assets/gif/gifsource/t4mu.gif" alt="blah blah blah"/>';
    galleryHTML += '</div>';
*/

    var url = "https://mightytext.co:5000?function=getContent&type=gif";

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        timeout: 5000,
        tryCount: 0,
        retryLimit: 1,
        success: function(response) {
            //console.log(response);
            if(!response["error"]){
                addGalleryContent(origin, gallery, response);
            }
        },
        error: function(response) {
            console.error(response);
        }
    });

}

function addGalleryContent(origin, gallery, content){
    
    $(content).each(function(index, elem){
        var contentHTML = '<div class="gif-image-wrapper">';
        contentHTML += '<img class="gif-image" src="' + elem["imgURL"] + '" data-gifsource="' + elem["gifURL"] + '" data-stillsource="' + elem["imgURL"] + '" alt="blah blah blah"/>';
        contentHTML += '</div>';

        var galleryInnerWrapper = $(gallery).find(".gif-gallery-inner-wrapper");

        $(contentHTML).appendTo(galleryInnerWrapper).each(function(){

            var thisImage = $(this).find(".gif-image");

            $(this).on("click", function(){
                                
                insertImageIntoComposeBody(origin, thisImage);
                
            });
            
            $(this).hover(function(e){
                
                var gifSRC = $(thisImage).data("gifsource");
                
                $(thisImage).attr("src", gifSRC);
                
            }, function(e){
                var stillSRC = $(thisImage).data("stillsource");
                
                $(thisImage).attr("src", stillSRC);
            })

            
        });

    });
    
}

function insertGmailGifButton(summary) {
/*     console.log("bingo was his name-o"); */
    console.log(summary);
    $(summary).each(function(){
        var insertedElem = this["added"];
        
        if(insertedElem["length"] > 0){
            //if we get here then we know that an send button row was added. 
            
            appendGifButton(insertedElem[0]);
            
        }
        
    })
}

function listenForChangesInGmailDom() {
//THE CODE IN THIS FUNCTION LISTENS FOR ELEMENTS THAT FIT THE QUERIES DEFINED IN THE SUMMARYOBSERVER VARIABLES.  THE DIV ELEMENTS I'M LOOKING FOR SHOULD BE EXPLAINED BY THE NAME OF THE CALLBACK FUNCTIONS THEY ARE CALLING.  DIV.AIN IS THE ELEMENT THAT HAS GMAIL'S SELECTED CSS APPLIED TO IT.  SPAN.ATA-ASJ IS THE 
    
    var summaryObserver = new MutationSummary({
        callback: insertGmailGifButton,
        queries: [{ element: 'div.aDh' }]
    }); 
    
};

function setEndOfContenteditable(contentEditableElement)
{
//KL CRV:THE PURPOSE OF THIS FUNCTION IS TO SET THE CURSOR AT THE END OF RESPONSE AREA
    //console.log('setEndOfContentEditable');
    //console.log(contentEditableElement);
    var range, selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
//        console.log(range);
        range.selectNodeContents(contentEditableElement[0]);//Select the entire contents of the element with the range
//        console.log(range);
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//        console.log(range);
        selection = window.getSelection();//get the selection object (allows you to change selection)
//        console.log(selection);
        selection.removeAllRanges();//remove any selections already made
//        console.log(selection);
        selection.addRange(range);//make the range you have just created the visible selection
        console.log(selection);
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement[0]);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

function getThePositionRelativeToTheScrollableDiv(elemSelector){
    var topValue = 0;
    var elemOffsetParent = $(elemSelector).offsetParent(); 
    
    
}

initializeApp();