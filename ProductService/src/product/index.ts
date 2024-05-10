/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

/**
 * Universal Unique IDentifier
 * @pattern ^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$
 * @example 123e4567-e89b-12d3-a456-426655440000
 */
export type UUID = string;

export interface Product {
  id: UUID,
  name: string,
  description: string,
  price: number,
  rating: number,
  image: string
}
