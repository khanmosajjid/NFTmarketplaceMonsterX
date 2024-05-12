import $ from 'jquery';

export const loadHeroContent = () => {
    var i = 1;

    $('.hero__inner__blk.owl-carousel .owl-dot').each(function () {
        $(this).text(i);
        i++;
    });
  } 