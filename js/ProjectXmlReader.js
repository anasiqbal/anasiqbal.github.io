function BuildPage(xml) {
	var i;
	var xmlDoc = xml.responseXML;
	var html = "";

	var xmlItem = xmlDoc.getElementsByTagName("Project");
	for (i = 0; i < xmlItem.length; i++) {
		var indicators, items = "";
		var images = xmlItem[i].getElementsByTagName("Image");
		for (img = 0; img < images.length; img++) {
			if (img == 0) {
				indicators = "<li data-target=\"#projectCarousel" + i + "\" data-slide-to=" + img + " class=\"active\"></li>";
				items = "<div class=\"item active\"><img class=\"fixed-height\" src=\"" + images[img].getAttribute("path") + "\" alt=\"" + images[img].getAttribute("name") + "\"></div>";
			} else {
				indicators += "<li data-target=\"#projectCarousel" + i + "\" data-slide-to=" + img + "></li>";
				items += "<div class=\"item\"><img class=\"fixed-height\" src=\"" + images[img].getAttribute("path") + "\" alt=\"" + images[img].getAttribute("name") + "\"></div>";
			}
		}
		
		var iFrames = "";
		var videos = xmlItem[i].getElementsByTagName("Video");
		for (vid = 0; vid < videos.length; vid++) {
			iFrames += "<iframe class=\"video\" src=\"" + videos[vid].getAttribute("link") + "\" width=\"400\" height=\"225\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"
		}
		
		var name = xmlItem[i].getAttribute("name");
		var appStoreLink = xmlItem[i].getAttribute("appstore");
		var playStoreLink = xmlItem[i].getAttribute("playstore");
		var tags = xmlItem[i].getElementsByTagName("Tags")[0].childNodes[0].nodeValue;
		
		var disclaimer = xmlItem[i].getElementsByTagName("Disclaimer");
		if(disclaimer.length > 0) {
			disclaimer = xmlItem[i].getElementsByTagName("Disclaimer")[0].childNodes[0].nodeValue;
		}
		else {
			disclaimer = "";
		}
		
		var description = GetDescription(xmlItem[i].getElementsByTagName("Description")[0].childNodes);
		
		var project = "";
		
		if(images.length > 0) {
			project = "<br><div class=\"row\"><div class=\"col-xs-4 col-sm-4 col-md-4 col-lg-4\"><div id=\"projectCarousel" + i + "\" class=\"carousel slide\"><ol class=\"carousel-indicators\">" + indicators + "</ol><div class=\"carousel-inner\">" + items + "</div><a class=\"left carousel-control\" href=\"#projectCarousel" + i + "\" role=\"button\" data-slide=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span><span class=\"sr-only\">Previous</span></a><a class=\"right carousel-control\" href=\"#projectCarousel" + i + "\" role=\"button\" data-slide=\"next\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span><span class=\"sr-only\">Next</span></a></div></div><div class=\"col-xs-8 col-sm-8 col-md-8 col-lg-8\">";
		}
		else {
			project = "<br><div class=\"row\"><div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">";
		}
		
		// Set title
		project += "<h4>" + name + "<br><small><blockquote>" + tags + "</blockquote></small></h4>";
		
		// Set disclaimer
		if (disclaimer) {
			project += "<blockquote>" + disclaimer + "</blockquote>";
		}
		
		// Set description
		project += description;
		
		// set download links
		if (appStoreLink) {
			project += "<a href=\"" + appStoreLink + "\"><img src=\"/img/app_store_badge.svg\"></a>";
		}
		if (playStoreLink) {
			project += "<a href=\"" + playStoreLink + "\"><img width=\"155px\" src=\"/img/google-play-badge.png\"></a>";
		}
		
		if(iFrames) {
			project += "<div>" + iFrames + "</div>";
		}
		
		// set closing tags
		project += "</div></div><br>";

		if (i != xmlItem.length - 1) {
			project += "<hr>";
		}

		html += project;
	}

	document.getElementById("Projects").innerHTML = html;
}

function LoadXMLDoc(path) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			BuildPage(this);
		}
	};
	xmlhttp.open("GET", path, true);
	xmlhttp.send();
}

function GetDescription(descriptionNodes) {
	var description = "";
	for (i = 0; i < descriptionNodes.length; i++) {
		if (descriptionNodes[i].tagName == "ul") {
			description += "<ul>";
			description += GetDescription(descriptionNodes[i].childNodes);
			description += "</ul>";
		} else if (descriptionNodes[i].tagName == "p" || descriptionNodes[i].tagName == "li") {

			description += "<" + descriptionNodes[i].tagName + ">";
			description += descriptionNodes[i].childNodes[0].nodeValue;
			description += "</" + descriptionNodes[i].tagName + ">";
		}
	}

	return description;
}