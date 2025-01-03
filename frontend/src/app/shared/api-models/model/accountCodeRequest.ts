/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ClientLocationModel } from './clientLocationModel';


/**
 * Login request object for account code validation
 */
export interface AccountCodeRequest { 
    /**
     * The 2FA code
     */
    code: string;
    clientLocation: ClientLocationModel;
}

