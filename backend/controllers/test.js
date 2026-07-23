import Skill from "../models/Skill.js";
import mongoose from "mongoose";

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    const {
      name,
      category,
      proficiencyLevel,
      yearsOfExperience,
      description,
      imageUrl,
      imagePublicId,
      order,
      featured,
    } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({
      user: req.user.id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create({
      user: req.user.id,
      name: name.trim(),
      category,
      proficiencyLevel: proficiencyLevel || "Intermediate",
      yearsOfExperience: yearsOfExperience || 0,
      description: description || "",
      imageUrl: imageUrl || "",
      imagePublicId: imagePublicId || "",
      order: order || 0,
      featured: featured || false,
    });

    await skill.populate("user", "name email");

    res.status(201).json({
      success: true,
      data: skill,
      message: "Skill created successfully",
    });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating skill",
      error: error.message,
    });
  }
};

// @desc    Get all skills for authenticated user
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res) => {
  try {
    const {
      category,
      proficiencyLevel,
      featured,
      sortBy = "order",
      sortOrder = "asc",
      page = 1,
      limit = 50,
    } = req.query;

    // Build filter object
    const filter = { user: req.user.id };

    if (category) {
      filter.category = category;
    }

    if (proficiencyLevel) {
      filter.proficiencyLevel = proficiencyLevel;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const skills = await Skill.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email");

    // Get total count for pagination
    const totalCount = await Skill.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: skills,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
      message: "Skills retrieved successfully",
    });
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving skills",
      error: error.message,
    });
  }
};

// @desc    Get all skills for a specific user (public)
// @route   GET /api/skills/user/:userId
// @access  Public
export const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, featured, sortBy = "order", sortOrder = "asc" } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Build filter object
    const filter = { user: userId };

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skills = await Skill.find(filter)
      .sort(sort)
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: skills,
      count: skills.length,
      message: "User skills retrieved successfully",
    });
  } catch (error) {
    console.error("Get user skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving user skills",
      error: error.message,
    });
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Private
export const getSkill = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate skill ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    }).populate("user", "name email");

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
      message: "Skill retrieved successfully",
    });
  } catch (error) {
    console.error("Get skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving skill",
      error: error.message,
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      proficiencyLevel,
      yearsOfExperience,
      description,
      imageUrl,
      imagePublicId,
      order,
      featured,
    } = req.body;

    // Validate skill ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    // Find skill
    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Check for duplicate name if name is being updated
    if (name && name !== skill.name) {
      const existingSkill = await Skill.findOne({
        user: req.user.id,
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id },
      });

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: "Skill with this name already exists",
        });
      }
    }

    // Update fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (category !== undefined) updateFields.category = category;
    if (proficiencyLevel !== undefined) updateFields.proficiencyLevel = proficiencyLevel;
    if (yearsOfExperience !== undefined) updateFields.yearsOfExperience = yearsOfExperience;
    if (description !== undefined) updateFields.description = description;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
    if (imagePublicId !== undefined) updateFields.imagePublicId = imagePublicId;
    if (order !== undefined) updateFields.order = order;
    if (featured !== undefined) updateFields.featured = featured;

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    res.status(200).json({
      success: true,
      data: updatedSkill,
      message: "Skill updated successfully",
    });
  } catch (error) {
    console.error("Update skill error:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating skill",
      error: error.message,
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate skill ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await Skill.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting skill",
      error: error.message,
    });
  }
};

// @desc    Delete all skills for authenticated user
// @route   DELETE /api/skills
// @access  Private
export const deleteAllSkills = async (req, res) => {
  try {
    const result = await Skill.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
      },
      message: `${result.deletedCount} skills deleted successfully`,
    });
  } catch (error) {
    console.error("Delete all skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting skills",
      error: error.message,
    });
  }
};

// @desc    Update skill order (for drag-and-drop reordering)
// @route   PATCH /api/skills/reorder
// @access  Private
export const reorderSkills = async (req, res) => {
  try {
    const { skillIds } = req.body;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill IDs array",
      });
    }

    // Validate all skill IDs
    const invalidIds = skillIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill IDs provided",
      });
    }

    // Update order for each skill
    const updatePromises = skillIds.map((skillId, index) =>
      Skill.findOneAndUpdate(
        { _id: skillId, user: req.user.id },
        { order: index },
        { new: true }
      )
    );

    const updatedSkills = await Promise.all(updatePromises);

    // Filter out null values (skills that weren't found)
    const validUpdatedSkills = updatedSkills.filter(skill => skill !== null);

    if (validUpdatedSkills.length !== skillIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some skills were not found or don't belong to you",
      });
    }

    res.status(200).json({
      success: true,
      data: validUpdatedSkills,
      message: "Skills reordered successfully",
    });
  } catch (error) {
    console.error("Reorder skills error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while reordering skills",
      error: error.message,
    });
  }
};

// @desc    Get skills statistics
// @route   GET /api/skills/stats
// @access  Private
export const getSkillsStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate statistics
    const stats = await Skill.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSkills: { $sum: 1 },
          featuredSkills: {
            $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] }
          },
          avgYearsExperience: { $avg: "$yearsOfExperience" },
          categoryBreakdown: {
            $push: "$category"
          },
          proficiencyBreakdown: {
            $push: "$proficiencyLevel"
          }
        }
      }
    ]);

    if (!stats.length) {
      return res.status(200).json({
        success: true,
        data: {
          totalSkills: 0,
          featuredSkills: 0,
          avgYearsExperience: 0,
          categoryBreakdown: {},
          proficiencyBreakdown: {},
        },
        message: "No skills found",
      });
    }

    const result = stats[0];

    // Process category breakdown
    const categoryCount = result.categoryBreakdown.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Process proficiency breakdown
    const proficiencyCount = result.proficiencyBreakdown.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalSkills: result.totalSkills,
        featuredSkills: result.featuredSkills,
        avgYearsExperience: Math.round(result.avgYearsExperience * 100) / 100,
        categoryBreakdown: categoryCount,
        proficiencyBreakdown: proficiencyCount,
      },
      message: "Skills statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Get skills stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving skills statistics",
      error: error.message,
    });
  }
};