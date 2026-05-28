import { Schema, model } from "mongoose";

/* ================= TRACK SUB-SCHEMA ================= */
const TrackSchema = new Schema(
  {
    trackTitle: {
      type: String,
      required: true,
      trim: true,
    },

    primaryArtist: {
      type: String,
      required: true,
      trim: true,
    },

    publisher: {
      type: String,
      trim: true,
    },

    language: {
      type: String,
      trim: true,
    },
     previouslyReleased: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },

    isrc: {
      type: String,
      uppercase: true,
      trim: true,
    },

    writers: {
      type: [String],
      default: [],
    },

    composers: {
      type: [String],
      default: [],
    },

    musicDirectors: {
      type: [String],
      default: [],
    },

    producers: {
      type: [String],
      default: [],
    },

    audioUrl: {
      type: String,
    },

    lyrics: {
      type: String,
    },
  },
  { _id: true }
);

/* ================= RELEASE SCHEMA ================= */
const ReleaseSchema = new Schema(
  {
    /* ========== USER ========== */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ========== RELEASE DETAILS ========== */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
      default: "",
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
    },

    subgenre: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    copyrightText: {
      type: String,
      trim: true,
      default: "",
    },

    productionYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },

    originalReleaseDate: {
      type: Date,
    },

    digitalReleaseDate: {
      type: Date,
    },

    upc: {
      type: String,
      trim: true,
    },

    /* ========== COVER ========== */
    cover: {
      type: String, // image URL
    },

    coverImageId: {
      type: String, // cloudinary public id
    },

    /* ========== TRACKS ========== */
    tracks: {
      type: [TrackSchema],
      default: [],
    },

    /* ========== STORES ========== */
    stores: {
      type: [String], // ["spotify", "apple"]
      default: [],
    },

    /* ========== FLOW CONTROL ========== */
    currentStep: {
      type: String,
      enum: ["release", "tracks", "stores", "submission"],
      default: "release",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Inactive",
        "Unfinished",
        "Action Required",
      ],
      default: "Unfinished",
    },
  },
  { timestamps: true }
);

export default model("Release", ReleaseSchema);
