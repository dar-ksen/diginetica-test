"use strict";
/*eslint-disable*/
(function () {
  console.log("test");

  var stepsSlider = document.getElementById("steps-slider");
  var inputMin = document.getElementById("input-min");
  var inputMax = document.getElementById("input-max");
  var inputs = [inputMin, inputMax];

  noUiSlider.create(stepsSlider, {
    start: [1000, 1000000],
    connect: true,
    step: 100,
    range: {
      min: 0,
      max: 1100000,
    },
    format: wNumb({
      decimals: 0,
      thousand: " ",
      suffix: "",
    }),
  });

  stepsSlider.noUiSlider.on("update", function (values, handle) {
    inputs[handle].value = values[handle];
  });

  inputs.forEach(function (input, handle) {
    input.addEventListener("change", function () {
      stepsSlider.noUiSlider.setHandle(handle, this.value);
    });

    input.addEventListener("keydown", function (e) {
      var values = stepsSlider.noUiSlider.get();
      var value = Number(values[handle]);
      var steps = stepsSlider.noUiSlider.steps();
      var step = steps[handle];
      var position;

      switch (e.which) {
        case 13:
          stepsSlider.noUiSlider.setHandle(handle, this.value);
          break;
        case 38:
          position = step[1];
          if (position === false) {
            position = 1;
          }
          if (position !== null) {
            stepsSlider.noUiSlider.setHandle(handle, value + position);
          }
          break;
        case 40:
          position = step[0];
          if (position === false) {
            position = 1;
          }
          if (position !== null) {
            stepsSlider.noUiSlider.setHandle(handle, value - position);
          }
          break;
      }
    });
  });
})();
