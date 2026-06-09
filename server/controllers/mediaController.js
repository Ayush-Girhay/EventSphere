const Media = require("../models/Media");
console.log("Notification Model Loaded");
const Notification = require("../models/Notification");
const cloudinary = require("../config/cloudinary");

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    // Delete from Cloudinary
    if (media.public_id) {
      await cloudinary.uploader.destroy(
        media.public_id
      );
    }

    // Delete from MongoDB
    await Media.findByIdAndDelete(id);

    // Realtime update
    if (global.io) {
      global.io.emit("mediaDeleted", {
        mediaId: id,
      });
    }

    res.json({
      success: true,
      message: "Media deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Delete failed",
    });
  }
};

const generateAITags = (
  title
) => {
  const text =
    title.toLowerCase();

  let tags = [];

  if (
    text.includes("football")
  ) {
    tags.push(
      "sports",
      "football",
      "stadium"
    );
  }

  if (
    text.includes("cricket")
  ) {
    tags.push(
      "sports",
      "cricket"
    );
  }

  if (
    text.includes("birthday")
  ) {
    tags.push(
      "birthday",
      "party",
      "celebration"
    );
  }

  if (
    text.includes("ronaldo")
  ) {
    tags.push(
      "football",
      "sports",
      "player"
    );
  }

  if (
    text.includes("beach")
  ) {
    tags.push(
      "beach",
      "travel",
      "nature"
    );
  }

  if (
    text.includes("fest")
  ) {
    tags.push(
      "event",
      "college",
      "crowd"
    );
  }

  if (
    text.includes("tech")
  ) {
    tags.push(
      "technology",
      "event"
    );
  }

  if (
    text.includes("friends")
  ) {
    tags.push(
      "people",
      "group"
    );
  }

  if (
    text.includes("sunset")
  ) {
    tags.push(
      "nature",
      "sky",
      "travel"
    );
  }

  if (
    tags.length === 0
  ) {
    tags.push(
      "photo",
      "gallery"
    );
  }

  return [
    ...new Set(tags),
  ];
};

const generateAICaption = (
  title
) => {
  const text =
    title.toLowerCase();

  if (
    text.includes("football")
  ) {
    return "A football match taking place inside a stadium.";
  }

  if (
    text.includes("cricket")
  ) {
    return "Players participating in a cricket match.";
  }

  if (
    text.includes("birthday")
  ) {
    return "People celebrating a birthday event.";
  }

  if (
    text.includes("beach")
  ) {
    return "A scenic beach and travel destination.";
  }

  if (
    text.includes("friends")
  ) {
    return "A group of friends enjoying a memorable moment.";
  }

  if (
    text.includes("sunset")
  ) {
    return "A beautiful sunset captured in nature.";
  }

  if (
    text.includes("fest")
  ) {
    return "Participants attending a college fest event.";
  }

  return "A photo uploaded to EventSphere.";
};

exports.uploadMedia = async (
  req,
  res
) => {
  try {
    const files = req.files;

    const visibility =
      req.body.visibility ||
      "public";

      const title =
  req.body.title || "";

  const taggedUsers =
  JSON.parse(
    req.body.taggedUsers ||
      "[]"
  );

  const aiTags =
  generateAITags(title);

  const aiCaption =
  generateAICaption(
    title
  );

  console.log(
  "TITLE:",
  title
);

console.log(
  "AI TAGS:",
  aiTags
);

     
    if (
      !files ||
      files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No files uploaded",
      });
    }

    const uploadedMedia = [];

    for (const file of files) {
      const result =
        await cloudinary.uploader.upload(
          file.path,
          {
            folder:
              "eventsphere",
          }
        );

      
  const media =
  await Media.create({
    
    
    title,

    caption:
      aiCaption,

    tags:
      aiTags,

      taggedUsers,

    filename:
      file.originalname,

    url:
      result.secure_url,

    public_id:
      result.public_id,

    visibility,

    uploadedBy:
      req.user.id,
  });

      uploadedMedia.push(
        media
      );

       for (
   const userId
   of taggedUsers
 ) {
   await Notification.create({
     user: userId,
     message:
       "🏷 You were tagged in a photo",
   });

   if (global.io) {
     global.io.emit(
      "notification",
       {
         userId,
         message:
           "🏷 You were tagged in a photo",
       }
     );
   }
}
    }

    res.status(201).json({
      success: true,
      uploadedMedia,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Upload failed",
    });
  }
};

// Get All Media
exports.getMedia = async (req, res) => {
  try {
    const role =
  req.user?.role;

let mediaFiles;

if (
  role === "Admin" ||
  role === "Photographer" ||
  role === "Club Member"
) {
  mediaFiles =
    await Media.find()
      .populate(
        "uploadedBy",
        "name"
      );
} else {
  mediaFiles =
    await Media.find({
      visibility: "public",
    }).populate(
      "uploadedBy",
      "name"
    );
}

    console.log(
      JSON.stringify(mediaFiles, null, 2)
    );

    console.log(
  JSON.stringify(
    mediaFiles[0],
    null,
    2
  )
);

    res.json({
      success: true,
      mediaFiles,
    });
  } catch (error) {
    console.log(error);
  }
};

// Like Media
exports.likeMedia = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const media =
      await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const alreadyLiked =
      media.likedBy.some(
        (user) =>
          user.toString() === userId
      );

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message:
          "You already liked this image",
      });
    }

    media.likes++;

    media.likedBy.push(userId);

    await media.save();

console.log("LIKE CALLED");
console.log("Uploaded By =", media.uploadedBy);

const notification =
  await Notification.create({
    user: media.uploadedBy,
    message:
      "❤️ Someone liked your photo",
  });

  if (global.io) {
  global.io.emit(
    "notification",
    {
      userId: media.uploadedBy,
      message:
        "❤️ Someone liked your photo",
    }
  );
}

console.log(
  "NOTIFICATION CREATED:",
  notification
);

console.log("Notification created");


    if (global.io) {
      global.io.emit(
        "mediaLiked",
        {
          mediaId: media._id,
          likes: media.likes,
        }
      );
    }

    res.json({
      success: true,
      likes: media.likes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Like failed",
    });
  }
};

// Add Favorite
exports.addFavorite = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const media =
      await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const alreadyFavorited =
      media.favoritedBy.some(
        (user) =>
          user.toString() === userId
      );

    if (alreadyFavorited) {
      return res.status(400).json({
        success: false,
        message:
          "You already favorited this image",
      });
    }

    media.favorites++;

    media.favoritedBy.push(userId);

    await media.save();

    await Notification.create({
    user: media.uploadedBy,
    message:
        "⭐ Someone favorited your photo",
    });

    if (global.io) {
  global.io.emit(
    "notification",
    {
      userId: media.uploadedBy,
      message:
        "⭐ Someone favorited your photo",
    }
  );
}

    res.json({
      success: true,
      favorites:
        media.favorites,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Favorite failed",
    });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

   media.comments.push(text);

    await media.save();

    await Notification.create({
    user: media.uploadedBy,
    message:
        "💬 Someone commented on your upload",
    });

    if (global.io) {
  global.io.emit(
    "notification",
    {
      userId: media.uploadedBy,
      message:
        "💬 Someone commented on your upload",
    }
  );
}

if (global.io) {
  global.io.emit(
    "commentAdded",
    {
      mediaId: media._id,
      comments: media.comments,
    }
  );
}

res.json({
  success: true,
  comments: media.comments,
});

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Comment failed",
    });
  }
};

exports.searchMedia =
  async (req, res) => {
    try {
      const search =
        req.query.search || "";

      const media =
  await Media.find()
    .populate(
      "uploadedBy",
      "name"
    );

const filteredMedia =
  media.filter((item) => {
    const searchText =
      search.toLowerCase();

    return (
      item.title
        ?.toLowerCase()
        .includes(searchText) ||

      item.filename
        ?.toLowerCase()
        .includes(searchText) ||

      item.tags?.some((tag) =>
        tag
          .toLowerCase()
          .includes(searchText)
      ) ||

      item.uploadedBy?.name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

     res.json({
  success: true,
  media: filteredMedia,
});

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Search failed",
      });
    }
  };

  exports.getSimilarPhotos =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const media =
        await Media.findById(id);

      if (!media) {
        return res.status(404).json({
          success: false,
        });
      }

      const similar =
        await Media.find({
          _id: {
            $ne: media._id,
          },

          tags: {
            $in: media.tags,
          },
        }).limit(4);

      res.json({
        success: true,
        similar,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  };

  exports.getTaggedPhotos =
  async (req, res) => {
    try {
      const photos =
        await Media.find({
          taggedUsers:
            req.user.id,
        });

      res.json({
        success: true,
        photos,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  };