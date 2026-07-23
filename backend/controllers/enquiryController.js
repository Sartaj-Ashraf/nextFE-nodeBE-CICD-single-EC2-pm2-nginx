import PortfolioEnquiry from "../models/enquiryModel.js";
import { StatusCodes } from "http-status-codes";

export const createEnquiryEntry = async (req, res) => {
  try {
    const enquiry = await PortfolioEnquiry.create(req.body);
    res.status(StatusCodes.CREATED).json({ enquiry });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const getAllEnquiryEntries = async (req, res) => {
  try {
    const { 
      search, 
    } = req.query;
    
    const queryObject = {};

    // Enhanced search functionality
    if (search) {
      queryObject.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    // Setup pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Parallel queries for better performance
    const [enquiry, totalEnquiry, statusCounts] = await Promise.all([
      PortfolioEnquiry.find(queryObject)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean(), // Use lean() for better performance
      PortfolioEnquiry.countDocuments(queryObject),
      PortfolioEnquiry.aggregate([
        { $match: search ? { $or: queryObject.$or } : {} },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Format status counts
    const formattedStatusCounts = statusCounts.reduce((acc, item) => {
      acc[item._id || 'New'] = item.count;
      return acc;
    }, {});

    const numOfPages = Math.ceil(totalEnquiry / limit);

    res.status(StatusCodes.OK).json({
      totalEnquiry,
      numOfPages,
      currentPage: page,
      enquiry,
      statusCounts: formattedStatusCounts,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export const updateEnquiryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedEnquiry = await PortfolioEnquiry.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEnquiry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Enquiry not found' });
    }

    res.status(StatusCodes.OK).json({ enquiry: updatedEnquiry });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteEnquiryEntry = async (req, res) => {
  try {
    const enquiry = await PortfolioEnquiry.findByIdAndDelete(req.params.id);
    
    if (!enquiry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Enquiry not found' });
    }
    
    res.status(StatusCodes.OK).json({ message: 'Enquery deleted successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

