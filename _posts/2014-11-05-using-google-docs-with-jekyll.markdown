---
layout: post
title:  "Using Google Docs with Jekyll"
sub-title: ""
date:   2014-11-05 10:35:10
categories: 
    - jekyll
    - google
---

I've been using Jekyll for almost a year now and every time I do it gets better. So much so that I decided to build a client-site using Jekyll as the CMS. I of course discussed this with them first, disclosed some of the differences between WP (which they were currently using) and Jekyll. After some research and compromises, we decided to 'go for it!'

Fast-forward four months, site is launched and live, client loves it - but the reality of losing some of that WYSIWYG functionality was sobering and concerning them.

We revisited earlier conversations about this, clarifying that Jekyll is a 'static' site generator, but now we needed a solution. I couldn't find any packages out there that solved this exact problem, so I came up with my own. Rudimentary certainly, but completely effective.

---

 A specific request my client had was to be able to update their careers page, basically a listing of states containing available jobs; just a list, nothing fancy - enter Google Docs, mainly spreadsheets.

 Google Spreadsheets can be output as json data, so a simple list formated correctly replaces the data I had originally built in _data/careers.yml, then looping through this data using jQuery .getJson(), I get the data output as needed. I give my client access to the spreadsheet, they update it and voila - their page is updated.

Here's the little script I'm using:
<br>

{% highlight js %}
$.getJSON('https://spreadsheets.google.com/feeds/list/1IT57mBl8Eu8r-yCRt8srnxYb9nAtp57U1ZpHq5nosY0/od6/public/values?alt=json', function(data) {

  for (i = 0; i < data.feed.entry.length; i++) {
    var state = data.feed.entry[i]['gsx$state']['$t'];
    var title = data.feed.entry[i]['gsx$title']['$t'];

      careers = $('<ul class="bulleted"/>');
      careers.append('<li>' + title + '</li>');

      if (state == 'California') {
        $('.california-list').append(careers);
      }

      if (state == 'Colorado') {
        $('.colorado-list').append(careers);
      }

      if (state == 'Texas') {
        $('.texas-list').append(careers);
      }

      if (state == 'Utah') {
        $('.utah-list').append(careers);
      }
  }

});
{% endhighlight %}

---

The end-result looks like this: <a href="http://terracareassociates.com/careers/" target="_blank">http://terracareassociates.com/careers/</a>

In the future, I'll be expanding this to additional portions of the site so they have more control. This keeps them out of the code and build process and presents as a simple solution to simple, needed content updates.

Next, I'll discuss moving them off of the Jekyll blogging platform and using Bloggers API on a subdomain to give them more control of their articles - again removing that non-WYSIWYG hurdle.

<h5>FIN</h5>
