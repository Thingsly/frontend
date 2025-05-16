import { mockRequest } from '../request';

export const fetchServiceManagementList = async () => {
  const data = await mockRequest.get<ServiceManagement.Service[]>(
    '/getServiceManagementList'
  );
  return data;
};

export const fetchRuleEngineList = async (page = 1, pageSize = 10) => {
  const data = await mockRequest.get<Api.RuleEngine.Rule[] | null>(
    '/rule-engine/list',
    {
      params: {
        page,
        pageSize
      }
    }
  );
  return data;
};

export const fetchDataServiceList = async () => {
  const data = await mockRequest.get<Api.DataService.Data[] | null>(
    '/getDataServiceList'
  );
  return data;
};
