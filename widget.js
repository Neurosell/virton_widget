/**
 * Virton Application Widget
 * 
 * @author                  Neurosell
 * @version                 1.0.0
 * @since                   2025-05-10
 * @repository              https://github.com/Neurosell/virton_widget
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
            widgetPosition: "right"
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
        this.widgetFrame = null;
        this.widgetButton = null;
        this.isShown = false;

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

        // Put Styles and Container
        let styles = `
        @import url('https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

        .virton_wrapper{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 100%;
            max-width: 350px;
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
            width: 64px;
            height: 64px;
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

            background: #191919;

            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;

            -webkit-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
            -moz-box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
            box-shadow: 0px -16px 33px -6px rgba(34, 60, 80, 0.2);
        }

        .virton_toggle::after {
            content: "${tryOnLabel}";
            font-family: "Sansation", sans-serif;
            font-weight: 700;
            font-style: normal;
            color: #fff;
            position: fixed;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.75);
            padding: 3px 6px;
            margin-top: 60px;
            border-radius: 26px;
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

        let widgetAnimation = document.createElement("img");
        widgetAnimation.src = `${this.baseURL}virton/images/widget.gif`;
        self.widgetButton.appendChild(widgetAnimation);

        // Initialize Events
        self.BindEvents();
        self.OnInitialized();
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
                window.open(data?.url);
            }, 100);
        }

        self.SubscribeToEvent('OpenLinkInternal', HandleOpenLinkInternal);
        function HandleOpenLinkInternal(data) {
            setTimeout(function(){
                document.location.href = data?.url;
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
}