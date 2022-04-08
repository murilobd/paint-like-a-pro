[![Netlify Status](https://api.netlify.com/api/v1/badges/1d4bf466-ecaa-42c2-bf80-8357c73bc315/deploy-status)](https://app.netlify.com/sites/paint-like-a-pro/deploys)

# Paint like a pro

This webapp implements the pix2pix model generated using [tensorflow](https://www.tensorflow.org/tutorials/generative/pix2pix) (and it's highly inspired from [affinelayer implementaion](https://github.com/affinelayer/pix2pix-tensorflow)).

The step to resize images and get only the edges of it was done by using similar techniques from[yining1023](https://github.com/yining1023/pix2pix_tensorflowjs_lite).

The style transfer (to enable it, just pass `transferStyle=true` to URL as query param) was copy/paste from [https://github.com/reiinakano/arbitrary-image-stylization-tfjs](https://github.com/reiinakano/arbitrary-image-stylization-tfjs). Thanks for that awesome model that just works.

All images for the model were downloaded from [https://en.most-famous-paintings.com/MostFamousPaintings.nsf/ListOfTop1000MostPopularPainting](https://en.most-famous-paintings.com/MostFamousPaintings.nsf/ListOfTop1000MostPopularPainting).

Thanks to [Christopher Hesse](https://twitter.com/christophrhesse) for this [blog post](https://affinelayer.com/pixsrv/) showing a pix2pix in action! Was super inspiring!

All the other stuffs (html?) were done by me! Tks!

## How to use it

Draw in the 1st canvas and press the 'paint' button right next to it. See the magic!
If you want to load an image, you can too. But mind the image should be a sketch (it means white background and black lines).

You can test it from this [https://paint-like-a-pro.netlify.app/](https://paint-like-a-pro.netlify.app/)

If you want to test in your computer, is simple as forking this repo and serving the index.html file.
