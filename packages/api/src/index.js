"use strict";
require("dotenv").config();
const AWS = require("aws-sdk");
const AwsAccountId = process.env.AWS_ACCOUNT_ID;
const { ResponseHelpers } = require("./response-helper");


module.exports.getQuickSightUrl = async event => {
  try {
    const inputData =
      event && event.queryStringParameters
        ? event.queryStringParameters
        : event;

    // sanity checks
    const requiredParametersNotProvided = !inputData.dashboard_id;
    if (requiredParametersNotProvided)
      return ResponseHelpers.createFailureResult("NOT_ALLOWED");


    // assume role
    const sts = new AWS.STS();

    const data = await sts
      .assumeRole({
        RoleArn: process.env.ASSUME_ROLE,
        RoleSessionName: process.env.ROLE_SESSION_NAME
      })
      .promise();

    const dashboardId =
      inputData.dashboard_id === "default"
        ? process.env.DASHBOARD_ID
        : inputData.dashboard_id;
    const getDashboardParams = {
      UserArn: process.env.USER_ARN,
      AwsAccountId,
      DashboardId: dashboardId,
      IdentityType: "QUICKSIGHT",
      ResetDisabled: false,
      SessionLifetimeInMinutes: process.env.SESSION_LIFE_TIME_IN_MINUTES,
      UndoRedoDisabled: false
    };

    const assumeRole = {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken
    };

    const quicksightGetDashboard = new AWS.QuickSight(assumeRole);

    const response = await quicksightGetDashboard
      .getDashboardEmbedUrl(getDashboardParams)
      .promise();

    return ResponseHelpers.createSuccessResult(response);
  } catch (e) {
    console.log(e, e.message, e.stack);
    return ResponseHelpers.createFailureResult(e);
  }
};
