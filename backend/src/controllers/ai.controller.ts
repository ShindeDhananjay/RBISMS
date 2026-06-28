import { Request, Response } from 'express';
// We would ideally import all the survey models here to calculate real scores.
// For now, we will mock the AI aggregation logic as a foundational start.

export const generateScore = async (req: Request, res: Response) => {
  try {
    const { villageId } = req.params;

    // TODO: In a fully fleshed out system, we would query the database here:
    // const population = await GramPanchayatModel.findOne({ villageId });
    // const schools = await SchoolSurveyModel.countDocuments({ villageId });
    // const hospitals = await HospitalSurveyModel.countDocuments({ villageId });
    // const activeParcels = await ParcelModel.countDocuments({ villageId, status: 'Active' });

    // Mocking the aggregated data for the AI engine
    const aggregatedData = {
      populationSize: Math.floor(Math.random() * 10000) + 500, // 500 to 10500
      schoolsCount: Math.floor(Math.random() * 5),
      hospitalsCount: Math.floor(Math.random() * 3),
      factoriesCount: Math.floor(Math.random() * 2),
      activeCustomers: Math.floor(Math.random() * 50)
    };

    // --- The Scoring Algorithm (v1) ---
    let score = 0;
    
    // Demographic Weight (max 30 points)
    // 1 point for every 300 people, capped at 30
    let demographicScore = Math.min((aggregatedData.populationSize / 300), 30);
    
    // Infrastructure Weight (max 40 points)
    let infraScore = (aggregatedData.schoolsCount * 5) + (aggregatedData.hospitalsCount * 10) + (aggregatedData.factoriesCount * 5);
    infraScore = Math.min(infraScore, 40);

    // Existing Business Weight (max 30 points)
    let businessScore = Math.min((aggregatedData.activeCustomers * 1.5), 30);

    score = Math.round(demographicScore + infraScore + businessScore);

    // Determine Actionable Insight
    let insight = '';
    let category = '';
    if (score >= 75) {
      category = 'High Potential';
      insight = 'Excellent infrastructure and population density. Prioritize IPPB account conversion campaigns here.';
    } else if (score >= 40) {
      category = 'Medium Potential';
      insight = 'Steady growth area. Focus on standard deposit mobilization and tracking existing leads.';
    } else {
      category = 'Low Potential';
      insight = 'Low infrastructure presence. Consider targeted financial literacy camps before pushing high-tier products.';
    }

    res.status(200).json({
      success: true,
      data: {
        villageId,
        score,
        category,
        insight,
        breakdown: {
          demographics: Math.round(demographicScore),
          infrastructure: Math.round(infraScore),
          existingBusiness: Math.round(businessScore)
        },
        rawMetrics: aggregatedData
      }
    });

  } catch (error) {
    console.error('Error generating AI score:', error);
    res.status(500).json({ success: false, message: 'Server Error in AI Engine' });
  }
};
