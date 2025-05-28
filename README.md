# Virton AI Widget Documentation
<img src="https://virton.tech/ograph_en.jpg" alt="Virton AI - Virtual Fitting Room Widget" style="width: 100%" /><br/>

<p align="center">Welcome to the <b>Virton AI Widget for Online Stores</b> - free virtual fitting room for your website. Install at any online store website or web-apps by few clicks. Our fitting room updates every week and can be used as Telegram Web App or VK Mini App.</p>

<hr/>

<p align="center"><a href="https://virton.tech/en/manage/" target="_blank">Store Dashboard</a> | <a href="https://virton.tech/en/ecommerce/" target="_blank">About and Demo</a> | <a href="https://neurosell.top/">Developer's Website</a></p>

<hr/>

❓**Why Virton AI?**
- Full context preservation for trying on clothes for a specific look;
- Regular Updates for Every business;
- Easy installation and Products management for every website;
- Simple to use and easy to learn;
- Widget Customization using Dashboard;

**Supported Platforms:**
- Any online store;
- VK Mini Apps;
- Telegram Mini Apps;

**Coming Soon:**
- Advanced Analytics;
- In-motion Video support;
- Accessory, shoes and headwear support;

## Installation
Easy installation of the widget is quite simple, you will only need to follow a couple of steps, regardless of your online store platform.

### Create Store Dashboard
Go to the <a href="https://virton.tech/en/manage/">Virton AI official website and create store administrator account</a>. Add new products and setup widget visuals.

### Copy widget code
Copy and paste on every page, the widget code from <a href="https://virton.tech/en/manage/?go=settings">Virton AI Settings Page</a>.

**The widget code in its basic form looks something like this:**
```javascript
<script type="text/javascript" src="https://virton.tech/virton/widget.js"></script>
<script type="text/javascript">
(function() { const v = "YOUR_GENERATED_STORE_ID";const VClient = new VirtonWidget({storeID: v, lang: "ru"});VClient.Initialize(); })();
</script>
```
**Enjoy!**

## Widget Options
Basically, your online store widget can be customized using <a href="https://virton.tech/en/manage/?go=settings">Virton AI Settings Page</a>.
But if you need - you can use additional Widget Options.

**Let's overview some options below:**
```javascript
<script type="text/javascript" src="https://virton.tech/virton/widget.js"></script>
<script type="text/javascript">
const VClient = new VirtonWidget({
  storeID: "YOUR GENERATED STORE ID",    // GENERATED STORE ID
  lang: "ru",                            // CURRENT WIDGET LANGUAGE
  showWidgetButton: true,                // SHOW DEFAULT WIDGET BUTTON
  widgetPosition: "right"                // WIDGET POSITION
});
</script>
```

| Option Name | Type    | Description    |
| :---:   | :---: | :---: |
| storeID | string   | Your generated store ID. UUIDv4 format supports.   |
| lang | string   | Current Widget Language. Currenlty can be **ru** or **en**   |
| showWidgetButton | bool   | Show or hide default widget button at strat   |
| widgetPosition | string   | Current widget and button position. Can be **right** or **left**   |
| useTimedCTA | bool | Show / Hide Call-To-Action for widget by Time |
| timedCTATimeout | number | Time to show Call-To-Action for widget (in ms) |
| useCloseCTA | bool | Use Call-To-Action modal when user trying to close window | 

If you need to show your own widget button, or you want to directly show a try-on window for specific items from your site without showing the catalog, check out the instructions below.

## Direct Product Fitting
For starters, to display a custom fitting room show button, or to try things on directly from your site - you should connect the widget to all pages anyway, but with the default button disabled:
```javascript
<script type="text/javascript" src="https://virton.tech/virton/widget.js"></script>
<script type="text/javascript">
const VClient = new VirtonWidget({
  storeID: "YOUR GENERATED STORE ID",
  lang: "ru",
  showWidgetButton: false                // HIDE DEFAULT WIDGET BUTTON HERE
});
</script>
```

**You can now create link to show Virton AI widget:**
```
#showVirton
```

**Or to try things on directly in Virton AI Widget:**
```
#tryVirton|FULL_OUTFIT_URL|upper_body/lower_body/dresses
```

## Pricing and Contacts
**You can see the current prices of Virton AI and contact us through the official website:**
<a href="https://virton.tech/">virton.tech</a>
