"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MetadataSchema = new mongoose_1.Schema({
    artistName: { type: String, required: true, trim: true },
    trackTitle: { type: String, required: true, trim: true },
    album: { type: String, trim: true },
    label: { type: String, required: true, trim: true },
    isrc: { type: String, required: true, trim: true },
    upc: { type: String, trim: true },
    releaseDate: { type: String, trim: true },
    genre: { type: String, trim: true },
    composer: { type: String, trim: true },
    publisher: { type: String, trim: true },
    language: { type: String, trim: true },
    lyrics: { type: String, trim: true },
    contact: { type: String, trim: true },
    explicit: { type: Boolean, default: false },
    confirm: { type: Boolean, required: true },
    artwork: { type: String },
    artworkId: { type: String },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Approved", "Rejected"],
        default: "Pending",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Metadata", MetadataSchema);
