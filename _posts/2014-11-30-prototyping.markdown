---
layout: post
title:  "Protoyping"
sub-title: "Coding in the sandbox"
date:   2014-11-30 14:35:10
categories: 
    - css
    - UI
---

One of my favorite things to do as a front-end developer is to sandbox new components. Oh sure, we all have to bug fix, feature add, and unit test - but the chance to build something new, solve a new problem, start fresh brings a crazy kind of nerd-joy that I can't articulate well enough in this forum.

I was thinking this morning while making breakfast about a new kind of layout and as I was plotting a little Sunday development; I realized that I have a very distinct process for jumping into these projects, but I've never layed it out step-by-step.

Previously I have laid-out my <a href="/SDLC">Software Development Life Cycle</a> and as a theory I still refer to it when working with teams looking for an overall process. This is a different process, one with physical steps more clearly defined. One that pays criticial attention to the UI, Web Standards, and Accessibility. Additionally; protoyping components using this method, or a similar one, lends itself perfectly to the agile development environments that so many of us work in now. Okay, here goes:

<ol class="vertical">
<li>
    Always a visual; perhaps as simple as a sketch - maybe a fully developed comp.
</li>
<li>
    Mobile-First; HTML first - the key to production-ready code written in the prototype phase is to be purely semantic. The path to purely semantic HTML is to establish it before any style or function code decisions are made.

    My compenents tend to follow this architecture (just an example):

{% highlight html %}
<div class="widget">
    <h3>Heading</h3>
    <ul>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    <label for="">Input Field</label>
    <input type="text">
</div>
{% endhighlight %}

This sets me up for really clean CSS, with no crazy nesting requirements. It also let's me maintain global styles for elements like headings, lists, and forms - with the power to customize on an as-needed basis.
</li>
<li>
    It's CSS time! Creating reusable, modular, and DRY components that don't bleed and can therefore be used on any page of a site, and along with any other component, makes front-end to back-end hand-offs a breeze.
    <ul class="vertical bulleted">
        <li>
            CSS is written in Sass/Less
        </li>
        <li>
            Grunt/Gulp takes care of compiling, concatenating, and minifying as I work - this keeps my code performant and end-product testable in this early stage. A big win! There's nothing worse than trying to improve performance once a project has reached QA or UAT.
        </li>
        <li>
            I have some <a href="/styleguide#bestPractices-anchor">CSS/Sass best practices</a> already established. Adhering to these consistently prevents a lot of headache.
        </li>
    </ul>

{% highlight css %}
.widget {
    h3 {
        ...
    }

    ul {
        ...

        li {
            ...
        }
    }
}
{% endhighlight %} 
</li>
<li>
    Browser Test.

    <ul class="bulleted">
        <h4>Desktop Browsers</h4>
        <li>Chrome - last 3</li>
        <li>Firefox - last 3</li>
        <li>Safari - most recent release</li>
        <li>Internet Explorer (IE8 - IE11)</li>
        <hr>
        <h4>Mobile Browsers</h4>
        <li>
            iOS: Safari
        </li>
        <li>
            iOS: Google Chrome
        </li>
        <li>
            Android 4.x: Google Chrome
        </li>
        <li>
            Android 4.x: Firefox
        </li>
        <li>
            Windows: IE Mobile
        </li>
    </ul>
</li>
<li>
    The last piece to get added is functionality; Javascript. I lean towards UI functionality written in jQuery, more than vanilla javascript. I have some specific, past-exprience reasons for this:

    <ul class="vertical bulleted">
        <li>
            Typical front-end functionality revolve around reveals; hide/show, slide-up, slide-down, close, etc. These are quickly, and reliably achieved using jQuery.
        </li>
        <li>
            I like to write my FED functions as self-instantiating plugins. This allows me to reuse utilities that can be chained along with already existing ones. The idea for this came from  a terrific article on <a href="http://learn.jquery.com/plugins/basic-plugin-creation/">Creating a Basic Plugin.</a> I structure any new plugin following this format:

{% highlight js %}
(function($) {

  $.fn.widgetFunction = function() {
    $('.widgetFunction').change(function(){
      if ($(this).val() != 'null'){
        window.location.href = $(this).val();
      }
    });
  }

}(jQuery));

$('.widgetFunction').widgetFunction();
{% endhighlight %}           
        </li>
        <li>
            Lastly; I find that javascript almost always gets re-written by the back-end developer after hand-off anyway. 
        </li>
    </ul>
</li>
</ol>

<hr>

<h5>Create a process and stick to it.</h5>

This process works for me. It is based on the roles that I have had the opportunity to hold. Your experience and/or role on a team may be different, but having a process, however it looks, will increase your productivity, improve your code quality, and make you the hero of your back-end team.

Now get in the sandbox and start playing!

<h5>FIN</h5>
