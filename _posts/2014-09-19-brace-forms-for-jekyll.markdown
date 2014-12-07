---
layout: post
title:  "Copying the sender with Brace Forms"
sub-title: ""
date:   2014-09-19 9:17:10
categories: 
    - css
    - jquery
    - jekyll
    - brace
---

tl;dr - [take me to the code](#code)
<br><br>
--
<br><br>
I have fallen in love with Jekyll and hosting projects on Github. This has become my inspiration workflow.  
<br>

* Get an idea. 
* Buy a domain name. 
* Run my framework build. 
* Sprinkle in Jekyll. 
* Change the CNAME file, and BAM!
<br><br>

As I started my **Jekyll Journey** I realized that my typical email.php goto for forms wasn't gonna work (Github doesn't support php). So I went all #lazyweb and sent a tweet out asking for recommendations, along with googling an answer.  
<br>

There are a number of decent solutions out there, [simpleform](http://getsimpleform.com) and [wufoo](http://wufoo.com) just to name a few. The limitations to those services though are primarily the number of forms you can process in a month. With both of those previusly mentioned - that limit is 100 per month. I need more than that for a few of my builds, so I kept looking.  
<br>

Behold! [forms.brace.io](http://forms.brace.io) -- this just became my new favorite thing! Super simple integration, up to 1000 submissions per month with their free account and some built in goodies like _replyto, _cc, and _next. So I dove right in - everything was solid.  
<br>

Shortly after I launched a little web-based office football pool picking site, I had a feature request to copy the submitter with their picks from the form. 
<br>

I emailed the team at brace.io -- who has been super responsive and helpful in the early on if/when I ran into any issues -- and asked if/how I could use the _cc operative to do such a thing. Unfortunately, they had no baked in solution.
<br><br>

--
<br><br>
<a name="code"></a>
I needed this and I didn't want to start over with a different form solution so I looked at a few different methods involving Jekyll liquid tags; either I'm not smart enough or liquid tags can't capture and output values as they're input into a field.
<br>

No matter, a much simpler solution was available:  
<br>

<a name="code"></a>
First things first -- here's my form field for the user to input an email. I want to capture this!  

{% highlight html %}
<input id="email" type="email">
{% endhighlight %}
<br>

I will need this captured email address to populate the value attribute of this hidden field:

{% highlight html %}
<input type="hidden" id="copy" name="_cc" value="">
{% endhighlight %}

*that _name="_cc" is the Brace method for, you guessed it, cc'ing an additional email box
<br>

I WAY overthought this - the solution using jQuery was apparently just too straightforward the first time around:
<br>

{% highlight js %}
$(function() {
  $('#email').change(function() {
    var value = $(this).val();
    $('#copy') .val(value);
  });
});
{% endhighlight %}

Now whenever that email input changes, wether typed OR autofilled, the value in my hidden field populates and brace does the rest on the backend.
<br>

Hope this helps! Happy Jekyll'ing!!

<h5>FIN</h5>
