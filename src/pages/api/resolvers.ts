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

// Add you resolvers here - same as Assignment 2

import { AuthResolver } from '../../graphql/auth/resolver'

export const resolvers = [AuthResolver] as const;