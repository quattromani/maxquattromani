---
layout: post
title:  "Using calc() in less"
sub-title: "Let's do some maths"
permalink: using-calc-in-less
date:   2014-08-22 14:07:13
categories: 
    - css
---

Not sure if anyone else has run into this problem, but to celebrate a victory pulled from the jaws of defeat, I thought I’d share this tip.

To use css3 calc() with less you’ll need to play with the format a touch.

--

let’s assume a column gutter of .5em...in vanilla css, it looks like this -

{% highlight html %}
.half {
  float: left;
  width: calc(50% - .5em);
}
{% endhighlight %}

but if you run this little gem through less, it outputs:

{% highlight html %}
.half {
  float: left;
  width: (49.5%);
}
{% endhighlight %}

<img src="/images/posts/hahaha.jpg" alt="Hahaha, NO">

to get around this we need to tune down less’s aggression with the maths by escaping the percent unit.

{% highlight html %}
.half {
  float: left;
  width: calc(~"50% - “.5em);
}
{% endhighlight %}

and huzzah! we get the expected output:

.half {
  float: left;
  width: calc(50% - .5em);
}
