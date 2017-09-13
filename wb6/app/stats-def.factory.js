angular.module('app')
    .factory('StatsDef', [function(){
        return {
            dataAllSingle : {
                in_calls_queued_per_day: {name : "In interactions queued per day"},
                in_calls_short_abandoned_in_queue_per_day: {name : "In interactions short abandoned per day"},
                in_calls_abandoned_in_queue_per_day: {name : "In interactions abandoned per day"},
                in_calls_abandoned_in_queue_ratio_per_day: {name : "In interactions abandoned in queue ratio per day", format : "percent"},
                in_calls_short_abandoned_in_queue_ratio_per_day: {name : "In interactions abandoned ratio per day", format : "percent"},
                in_calls_waiting: {name : "In interactions waiting", format : "duration"},
                in_max_wait_time: {name : "In max wait time", format : "duration"},
                service_level_threshold_time: {name : "Inbound Service Level threshold", format : "duration"},
                service_level: {name : "Percentage of inbound interactions answered in Service Level", format : "percent"},
                in_calls_received_per_day : {name : "Inbound interactions received for the day"},
                out_calls_answered_per_day : {name : "Outbound successful calls attempts for the day"}
            },

            dataGridAgent : {
                first_last_name: {name : "First Name Last Name"},
                last_first_name: {name : "Last Name First Name"},
                active_item_talk_duration: {name : "Talk time", format : "duration"},
                active_item_hold_duration: {name : "Hold time", format : "duration"},
                state_ic: {name : "State icon"},
                acd_state: {name : "State"},
                state_duration: {name : "Time in state", format : "duration"},
                reason: {name : "Not ready reason"},
                login_time: {name : "Total Logon Time", format : "duration"},
                team_name: {name : "Team Name"},
                in_calls_handled_per_day: {name : "Calls Answered"},
                agent_total_break_time: {name : "Break Time", format : "duration"},
                agent_total_busy_time: {name : "Busy Time", format : "duration"},
                agent_total_ACW_time: {name : "ACW Time", format : "duration"},
                agent_total_ready_time: {name : "Ready Time", format : "duration"},
                calls_average_handling_time_per_day: {name : "IN Avg Handle Time", format : "duration"},
                active_item_media_type : {name : "Active Media"}
            },

            dataGridService : {
                name: {name : "Name"},
                service_level_threshold_time: {name : "Service level threshold", format : "duration"},
                service_level_target: {name : "Service level target"},
                service_level: {name : "Service level"},
                in_calls_waiting: {name : "In interactions waiting"},
                in_max_wait_time: {name : "Longest Waiting Interaction (Time)", format : "duration"},
                in_calls_abandoned_in_queue_per_day: {name : "Long Abandoned Count"},
                in_calls_short_abandoned_in_queue_per_day: {name : "Short Abandoned Count"},
                in_calls_abandoned_total_per_day: {name : "Abandoned Count"},
                in_calls_received_per_day: {name : "Received"},
                agents_busy: {name : "Agents in Busy"},
                in_calls_abandoned_in_queue_ratio_per_day: {name : "Long Abandoned %", format : "percent"},
                in_calls_short_abandoned_in_queue_ratio_per_day: {name : "Short Abandoned %", format : "percent"},
                in_calls_abandoned_percent_per_day: {name : "Abandoned %", format : "percent"},
                agents_logged: {name : "Skilled Agents logged in "}
            }
        }
    }])
