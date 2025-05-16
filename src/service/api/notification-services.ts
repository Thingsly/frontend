import { request } from '../request';

export const fetchNotificationServicesEmail = async () => {
  const data = await request.get<Api.NotificationServices.Email | null>(
    `/notification/services/config/EMAIL`
  );
  return data;
};

export const editNotificationServices = async (params: any) => {
  const data = await request.post<Api.BaseApi.Data>(
    '/notification/services/config',
    params
  );
  return data;
};

export const sendTestEmail = async (params: any) => {
  const data = await request.post<Api.BaseApi.Data>(
    '/notification/services/config/e-mail/test',
    params
  );
  return data;
};

export const fetchPushNotificationServices = async () => {
  const data =
    await request.get<Api.NotificationServices.PushNotification>(
      `/message_push/config`
    );
  return data;
};

export const editPushNotificationServices = async (params: any) => {
  const data = await request.post<Api.BaseApi.Data>(
    `/message_push/config`,
    params
  );
  return data;
};
