import { mockGetDistributionReport, mockGetCumplimientoReport } from "./mock";
import { apiFetch } from "./api";

const USE_MOCK = import.meta.env.PROD;

export const reportService = USE_MOCK
  ? {
      getDistribution: mockGetDistributionReport,
      getCumplimiento: mockGetCumplimientoReport,
    }
  : {
      async getDistribution(hogarId) {
        return apiFetch(`/households/${hogarId}/reports/distribution`);
      },
      async getCumplimiento(hogarId) {
        return apiFetch(`/households/${hogarId}/reports/cumplimiento`);
      },
    };
