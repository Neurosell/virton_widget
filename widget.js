/**
 * Virton Application Widget
 * 
 * @author                  Neurosell
 * @version                 1.0.0
 * @since                   2025-04-05
 * @repository              https://github.com/Neurosell/virton_client
 * @description             Virtual Try On Frontend Application
 * @developer               Ilya Rastorguev
 */
/* Virton Widget Class */
class VirtonWidget {
    /**
     * Setup Virton Widget
     * @param {object} options Virton Widget Options
     */
    constructor(options = {}){
        // Setup Options
        this.defaults = {
            storeID: null,
            lang: "en",
            showWidgetButton: true,
            widgetPosition: "left",
            useTimedCTA: true,
            timedCTATimeout: 3000,
            useCloseCTA: true
        };
        this.options = Object.assign(this.defaults, options);
        //this.baseURL = "http://localhost/"; // https://virton.tech/
        this.baseURL = "https://virton.tech/";
        console.log("Virton Widget Instance created with options", this.options);

        // Setup Widget Parameters and Base Widget URL
        let availableLanguages = ["en", "ru"];
        if(!this.options.lang || !availableLanguages.find(lng => lng == this.options.lang)) this.options.lang = "en";
        this.widgetURL = `${this.baseURL}${this.options.lang}/widget/${this.options.storeID}/#/start/`;

        // Setup Widget Window and Buttons
        this.widgetContainer = null;
        this.closeCTAContainer = null;
        this.timedCTAContainer = null;
        this.closeCTAContentContainer = null;
        this.closeCTAButton = null;
        this.applyCTAButton = null;
        this.widgetFrame = null;
        this.widgetButton = null;
        this.isShown = false;
        this.isShownCloseCTA = false;

        // Add Event Handlers
        this.OnInitialized = function() {
            console.log("Virton Client Initialized. Store ID: " + this.options.StoreID);
        };
        this.OnError = function(error) {
            console.error("Virton Client Error: " + error);
        };
    }

    /**
     * Store ID
     */
    get StoreID(){
        return this.options.storeID;
    }

    /**
     * Initialize Virton Widget
     */
    Initialize(){
        let self = this;
        if(!self.StoreID){
            self.OnError("Failed to Initialize Virton Widget. No store ID provided in widget");
            return false;
        }

        // Setup Labels
        let tryOnLabel = (self.options.lang == "ru") ? "Примерка" : "Try On";
        let timedCTALabel = (self.options.lang == "ru") ? "👋 Привет, хочешь увидеть как одежда будет смотреться на тебе?" : "👋 Hi, do you want to see how the clothes would look on you?";
        let closeCTAButtonLabel = (self.options.lang == "ru") ? "Нет, спасибо" : "No, thanks";
        let applyCTAButtonLabel = (self.options.lang == "ru") ? "В примерочную" : "Show Fitting Room";
        let innerCloseCTAContent = (self.options.lang == "ru") ? "Уже так быстро уходите? Посмотрите, какая одежда может подойти именно вам в нашей новой виртуальной примерочной. Это займет всего пару минут!" : "Leaving so soon already? See what clothes might fit you in our new virtual fitting room. It only takes a couple of minutes!";

        // Setup Styles by Poistion
        let widgetPositionStyles = ``;
        let widgetButtonPositionStyles = ``;
        if(self.options.widgetPosition != 'right' && self.options.widgetPosition != 'left') self.options.widgetPosition = 'right';
        switch (self.options.widgetPosition){
            case "left":
                widgetPositionStyles = `left: 30px;`;
                widgetButtonPositionStyles = `left: 30px;`;
                break;
            case "right":
                widgetPositionStyles = `right: 30px;`;
                widgetButtonPositionStyles = `right: 30px;`;
                break;
        }

        function processDOMInsert(){
            // Put Styles and Container
            let styles = `
            @import url('https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

            .virton_wrapper{
                position: fixed;
                bottom: 0;
                width: 100%;
                height: 100%;
                max-width: 400px;
                max-height: 640px;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                z-index: 9999;
                ${widgetPositionStyles}
                overflow: hidden;

                @media only screen and (max-width: 576px) {
                    left: auto;
                    right: auto;
                    max-width: none;
                    max-height: none;
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }

                -webkit-transition: all 0.1s ease;
                -moz-transition: all 0.1s ease;
                -ms-transition: all 0.1s ease;
                -o-transition: all 0.1s ease;
                transition: all 0.1s ease;

                -webkit-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
                -moz-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
                box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
            }

            .virton_wrapper.closed {
                height: 0;
            }

            .virton_toggle{
                position: fixed;
                bottom: 30px;
                ${widgetButtonPositionStyles}
                width: 80px;
                height: 80px;
                border-radius: 250px;
                border: none;
                z-index: 9998;

                overflow: hidden;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                align-content: center;
                justify-content: center;
                align-items: center;
                padding: 0;

                background: #191919;

                -webkit-transition: all 0.3s ease;
                -moz-transition: all 0.3s ease;
                -ms-transition: all 0.3s ease;
                -o-transition: all 0.3s ease;
                transition: all 0.3s ease;

                -webkit-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
                -moz-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
                box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);

                @media only screen and (max-width: 576px) {
                    width: 64px;
                    height: 64px;
                }
            }

            .virton_toggle::after {
                content: "${tryOnLabel}";
                font-family: "Sansation", sans-serif;
                font-weight: 700;
                font-style: normal;
                color: #fff;
                position: fixed;
                font-size: 12px;
                background: rgb(255, 0, 76);
                padding: 3px 6px;
                border-radius: 26px;
                margin-top: 75px;

                @media only screen and (max-width: 576px) {
                    margin-top: 60px;
                }
            }

            .virton_toggle img {
                max-width: 100%;
            }

            .virton_toggle.hidden {
                display: none;
            }
                
            .virton_frame{
                width: 100%;
                height: 100%;
                border: none;
                z-index: 2;
                position: relative;
            }
                
            .virton_close_cta{
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                align-content: center;
                justify-content: center;
                align-items: center;

                -webkit-transition: all 0.1s ease;
                -moz-transition: all 0.1s ease;
                -ms-transition: all 0.1s ease;
                -o-transition: all 0.1s ease;
                transition: all 0.1s ease;
            }
            
            .virton_close_cta.closed {
                height: 0;
                width: 100%;
                top: 0;
                left: 0;
                right: 0;
                bottom: 100%;
                overflow: hidden;
            }

            .virton_close_cta::before{
                content: "";
                position: absolute;
                z-index: 50;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }

            .virton_close_cta .inner{
                position: relative;
                z-index: 90;
                width: 100%;
                max-width: 500px;
                background: #fff;
                border-radius: 25px;
                padding: 25px;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                color: #191919;

                font-family: "Sansation", sans-serif;
                font-weight: 500;
                font-style: normal;
            }

            .virton_close_cta_close{
                border-radius: 25px;
                padding: 6px;
                border: 2px solid #191919;
                background: transparent;
                color: #191919;

                font-family: "Sansation", sans-serif;
                font-weight: 700;
                font-style: normal;
            }

            .virton_close_cta_close.apply{
                margin-bottom: 10px;
                background: #191919;
                color: #fff;
                margin-top: 15px;
            }
            
            .virton_timed_cta{
                position: fixed;
                bottom: 30px;
                left: 125px;
                padding: 10px;
                background: #fff;
                overflow: hidden;
                z-index: 9997;
                width: 300px;
                border-radius: 15px;
                cursor: pointer;
                color: #191919;

                font-family: "Sansation", sans-serif;
                font-weight: 500;
                font-style: normal;

                -webkit-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
                -moz-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
                box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);

                -webkit-transition: all 0.1s ease;
                -moz-transition: all 0.1s ease;
                -ms-transition: all 0.1s ease;
                -o-transition: all 0.1s ease;
                transition: all 0.1s ease;

                @media only screen and (max-width: 576px) {
                    bottom: 110px;
                    left: 30px;
                    right: 30px;
                    width: auto;
                }
            }

            .virton_timed_cta::after {
                content: "${timedCTALabel}";

                @media only screen and (max-width: 576px) {
                    font-size: 14px;
                }
            }
            
            .virton_timed_cta.closed {
                width: 0;
                height: 0;
                left: -500px;
                right: auto;
            }`;
            let styleSheet = document.createElement("style");
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
            
            // Create Wrapper Div
            self.widgetContainer = document.createElement("div");
            self.widgetContainer.id = "virtonWidget";
            self.widgetContainer.className = "virton_wrapper";
            document.body.appendChild(self.widgetContainer);
            self.widgetContainer.classList.toggle("closed", true);

            // Create Wrapper Frame
            self.widgetFrame = document.createElement("iframe");
            self.widgetFrame.className = "virton_frame";
            self.widgetFrame.id = "virtonFrame";
            self.widgetFrame.src = self.widgetURL;
            self.widgetContainer.appendChild(self.widgetFrame);

            // Create Widget Button
            self.widgetButton = document.createElement("button");
            self.widgetButton.type = "button";
            self.widgetButton.className = "virton_toggle";
            self.widgetButton.id = "virtonToggle";
            self.widgetButton.addEventListener("click", function(e){ self.ToggleWidget() });
            document.body.appendChild(self.widgetButton);
            if(!self.options?.showWidgetButton) self.widgetButton.classList.toggle("hidden", true);

            // Widget Button Image
            let widgetAnimation = document.createElement("img");
            widgetAnimation.src = `${self.baseURL}virton/images/widget.gif`;
            self.widgetButton.appendChild(widgetAnimation);

            // Timed CTA
            self.timedCTAContainer = document.createElement("div");
            self.timedCTAContainer.id = "virtonTimedCTA";
            self.timedCTAContainer.className = "virton_timed_cta";
            document.body.appendChild(self.timedCTAContainer);
            self.timedCTAContainer.classList.toggle("closed", true);
            self.timedCTAContainer.addEventListener("click", function(e){
                self.ShowWidget(true);
            });

            // Close CTA
            self.closeCTAContainer = document.createElement("div");
            self.closeCTAContainer.id = "virtonCloseCTA";
            self.closeCTAContainer.className = "virton_close_cta";
            document.body.appendChild(self.closeCTAContainer);
            self.closeCTAContainer.classList.toggle("closed", true);

            self.closeCTAContentContainer = document.createElement("div");
            self.closeCTAContentContainer.className = "inner";
            let p = document.createElement("p");
            self.closeCTAContentContainer.append(innerCloseCTAContent, p);
            
            self.applyCTAButton = document.createElement("button");
            self.applyCTAButton.type = "button";
            self.applyCTAButton.className = "virton_close_cta_close";
            self.applyCTAButton.id = "virtonApply";
            self.applyCTAButton.addEventListener("click", function(e){
                self.closeCTAContainer.classList.toggle("closed", true);
                self.ShowWidget(true);
            });
            self.applyCTAButton.classList.toggle("apply", true);
            self.applyCTAButton.append(applyCTAButtonLabel);

            self.closeCTAButton = document.createElement("button");
            self.closeCTAButton.type = "button";
            self.closeCTAButton.className = "virton_close_cta_close";
            self.closeCTAButton.id = "virtonClose";
            self.closeCTAButton.addEventListener("click", function(e){
                self.closeCTAContainer.classList.toggle("closed", true);
            });
            self.closeCTAButton.append(closeCTAButtonLabel);

            self.closeCTAContainer.appendChild(self.closeCTAContentContainer);
            self.closeCTAContentContainer.appendChild(self.applyCTAButton);
            self.closeCTAContentContainer.appendChild(self.closeCTAButton);

            // Initialize Events
            self.BindEvents();
            self.OnInitialized();
            self.BindEventedActions();
        }

        if(document.readyState === "complete") {
            processDOMInsert();
        } else if(document.readyState === "interactive") {
            processDOMInsert();
        } else {
            window.addEventListener("DOMContentLoaded", () => {
                processDOMInsert();
            });
        }
    }

    /**
     * Toggle Widget
     */
    ToggleWidget(){
        let self = this;
        self.ShowWidget(!self.isShown);
        console.log("Virton AI Widget Toggle: " + self.isShown);
    }

    /* Show Widget */
    ShowWidget(isShown = false){
        let self = this;
        self.isShown = isShown;
        self.widgetContainer.classList.toggle("closed", !isShown);
        self.widgetButton.classList.toggle("hidden", isShown);
        self.timedCTAContainer.classList.toggle("closed", true);
    }

    /* Show Outfit */
    ShowOutfit(garmentUrl, garmentType = "upper_body"){
        let self = this;
        if(!self.isShown) self.ShowWidget(true);
        self.widgetFrame.src = `${self.baseURL}${self.options.lang}/widget/${self.options.storeID}/#/start/?tab=confirm_garment&garment_type=${garmentType}&garment_url=${garmentUrl}`;
    }

    /* Bind Events From Frame */
    BindEvents(){
        let self = this;

        /* To Data URL */
        async function toDataURL(url) {
            const blob = await fetch(url).then(res => res.blob());
            return URL.createObjectURL(blob);
        }

        /* Close Widget Events */
        self.SubscribeToEvent('CloseWidget', HandleWidgetClose);
        function HandleWidgetClose(data) {
            self.ShowWidget(false);
        }

        /* External Link Event */
        self.SubscribeToEvent('OpenLink', HandleOpenLink);
        function HandleOpenLink(data) {
            setTimeout(function(){
                let finalUrl = new URL(data?.url);
                finalUrl.searchParams.append("utm_source", "virton_widget");
                finalUrl.searchParams.append("utm_content", "store_"+self.StoreID);
                finalUrl.searchParams.append("utm_term", "widget");
                finalUrl.searchParams.append("utm_campaign", "virton");
                window.open(finalUrl.toString());
            }, 100);
        }

        self.SubscribeToEvent('OpenLinkInternal', HandleOpenLinkInternal);
        function HandleOpenLinkInternal(data) {
            setTimeout(function(){
                let finalUrl = new URL(data?.url);
                finalUrl.searchParams.append("utm_source", "virton");
                finalUrl.searchParams.append("utm_content", "store_"+self.StoreID);
                finalUrl.searchParams.append("utm_term", "widget");
                finalUrl.searchParams.append("utm_campaign", "virton_widget");
                document.location.href = finalUrl.toString();
            }, 100);
        }

        /* Request Download */
        self.SubscribeToEvent('RequestDownload', HandleRequestDownload);
        function HandleRequestDownload(data) {
            setTimeout(function(){
                const a = document.createElement("a");
                toDataURL(data?.url).then(function(dataUrl){
                    a.href = dataUrl;
                    a.download = "result.jpeg";
                    a.target = "_blank";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            }, 100);
        }

        /* Any Buttons to Show Virton */
        const widgetShowButtons = document.querySelectorAll('a[href="#showVirton"]');
        widgetShowButtons.forEach(function (linkItem) {
            linkItem.addEventListener('click', function (event) {
                event.preventDefault();
                self.ShowWidget(true);
            });
        });

        /* Any Buttons to Show Outfit */
        const outfitShow = document.querySelectorAll('a[href^="#tryVirton"]');
        outfitShow.forEach(function (linkItem) {
            let currentLink = linkItem.getAttribute('href');
            let splitted = currentLink.split("|");
            if(splitted && splitted.length > 1) {
                let outfitLink = splitted[1];
                let outfitType = splitted?.[2] ?? "upper_body";
                linkItem.addEventListener('click', function (event) {
                    event.preventDefault();
                    self.ShowOutfit(outfitLink, outfitType);
                });
            }
        });
    }

    /* Bind Evented Actions */
    BindEventedActions(){
        let self = this;

        // Timed CTO
        if(self.options?.useTimedCTA){
            setTimeout(function(){
                self.ShowCallToActionTimed();
            }, self.options?.timedCTATimeout);
        }
        
        // Close Window CTO
        if(self.options?.useCloseCTA){
            let addEvent = function(obj, evt, fn) {
                if (obj.addEventListener) {
                    obj.addEventListener(evt, fn, false);
                }
                else if (obj.attachEvent) {
                    obj.attachEvent("on" + evt, fn);
                }
            };

            addEvent(document, "mouseout", function(event) {
                event = event ? event : window.event;
                var from = event.relatedTarget || event.toElement;
                if ( (!from || from.nodeName == "HTML") && event.clientY <= 100 ) {
                    self.ShowCallToActionClose();
                }
            });
        }
    }

    // Subscribe to Event
    SubscribeToEvent(eventName, eventHandler){
        const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        const eventer = window[eventMethod];
        const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent,function(e) {
            const key = e.message ? "message" : "data";
            const messageData = e[key];
            try{
                const parsedData = JSON.parse(messageData);
                if(parsedData.eventName == eventName){
                    eventHandler(parsedData.eventData);
                }
            }catch(ex){
                console.error("Unknown Event Received: ", messageData);
            }
        });
    }

    /* Show Call to Action */
    ShowCallToActionTimed(){
        let self = this;
        if(self.isShown) return;
        self.timedCTAContainer.classList.toggle("closed", false);

        // Bind Events
        setTimeout(function(){
            self.timedCTAContainer.classList.toggle("closed", true);
        }, 5000);
    }

    /* Show Call to Action Before Close */
    ShowCallToActionClose(){
        let self = this;
        if(self.isShownCloseCTA || self.isShown) return;
        let hasShownEarly = localStorage.getItem("hasShownFitting");
        if(hasShownEarly && hasShownEarly == "yes") return;
        self.closeCTAContainer.classList.toggle("closed", false);
        self.isShownCloseCTA = true;
        localStorage.setItem("hasShownFitting", "yes");
    }
}
