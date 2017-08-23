// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later

Diaspora.ProfilePhotoUploader = function() {
  this.initialize();
};

Diaspora.ProfilePhotoUploader.prototype = {
  constructor: Diaspora.ProfilePhotoUploader,

  initialize: function() {
    var that = this;

    var fileInput = $("#file-upload");
    var avatar = $("#profile_photo_upload").find(".avatar");
    new qq.FineUploaderBasic({
      element: document.getElementById("file-upload"),
      validation: {
        allowedExtensions: ["jpg", "jpeg", "png"],
        sizeLimit: 4194304
      },
      request: {
        endpoint: 'xxx',//Routes.photos(),
        params: {
          /* eslint-disable camelcase */
          authenticity_token: $("meta[name='csrf-token']").attr("content"),
          /* eslint-enable camelcase */
          photo: {"pending": true, "aspect_ids": "all", "set_profile_photo": true}
        }
      },
      button: document.getElementById("file-upload"),
      autoUpload: false,

      messages: {
        typeError: Diaspora.I18n.t("photo_uploader.invalid_ext"),
        sizeError: Diaspora.I18n.t("photo_uploader.size_error"),
        emptyError: Diaspora.I18n.t("photo_uploader.empty")
      },

      callbacks: {
        onProgress: function(id, fileName, loaded, total) {
          console.log('onProgress');
          var progress = Math.round(loaded / total * 100);
          $("#fileInfo").text(fileName + " " + progress + "%");
        },
        onSubmit: function(id, name) {
          console.log('onSubmit', id, name);
          $("#file-upload").addClass("loading");
          //$("#profile_photo_upload").find(".avatar").addClass("loading");
          //$("#file-upload-spinner").removeClass("hidden");
          //$("#fileInfo").show();

          var file = fileInput.find('input')[0].files[0];
          console.log(file);
          // FileReader support
          if (FileReader && file) {
            var fr = new FileReader();
            fr.onload = function () {
              console.log('onload');
              avatar.attr("src", fr.result);
              that.initializeCropper(avatar[0]);
            };
            fr.readAsDataURL(file);
          }
        },
        onComplete: function(id, fileName, responseJSON) {
          console.log('onComplete');
          $("#file-upload-spinner").addClass("hidden");
          $("#fileInfo").text(Diaspora.I18n.t("photo_uploader.completed", {"file": fileName}));
          $("#file-upload").removeClass("loading");

          if (responseJSON.data !== undefined) {
            /* flash message prompt */
            var message = Diaspora.I18n.t("photo_uploader.looking_good");
            if (app.flashMessages) {
              app.flashMessages.success(message);
            } else {
              alert(message);
            }

            var photoId = responseJSON.data.photo.id;
            var url = responseJSON.data.photo.unprocessed_image.url;
            var oldPhoto = $("#photo_id");
            if (oldPhoto.length === 0) {
              $("#update_profile_form")
                .prepend("<input type='hidden' value='" + photoId + "' id='photo_id' name='photo_id'/>");
            } else {
              oldPhoto.val(photoId);
            }

            $("#profile_photo_upload").find(".avatar").attr("src", url);
            $(".avatar[data-person_id=" + gon.user.id + "]").attr("src", url);
          }
          $("#profile_photo_upload").find(".avatar").removeClass("loading");
        },
        onError: function(id, name, errorReason) {
          if (app.flashMessages) {
            app.flashMessages.error(errorReason);
          } else {
            alert(errorReason);
          }
        }
      }
    });
  },
  initializeCropper: function (imgElement) {
    console.log('initializeCropper');
    var cropper = new Cropper(imgElement, {
      aspectRatio: 1,
      zoomable: false,
      crop: function(e) {
        console.log(e.detail.x);
        console.log(e.detail.y);
        console.log(e.detail.width);
        console.log(e.detail.height);
        console.log(e.detail.rotate);
        console.log(e.detail.scaleX);
        console.log(e.detail.scaleY);
      }
    });
  }
};
// @license-end
