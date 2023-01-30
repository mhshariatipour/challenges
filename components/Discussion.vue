<template>
    <div class="rounded-lg overflow-hidden md:text-base text-sm">
        <div class="head flex gap-3 items-center justify-between border-b-2 border-blue-light px-5 py-7">
            <div class="avatar img rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=12"/>
            </div>
            <div class="w-full relative">
                <input 
                    class="border-2 w-full border-gray-200 rounded-md bg-white py-3 px-4"
                    placeholder="Start a discussion"
                    v-model="textComment"
                    v-on:keyup.enter="insertComment"
                />
                <span class="w-full text-red-300 text-xs absolute -bottom-4 left-0">
                    {{ errorComment }}
                </span>
            </div>
        </div>
        <div class="body bg-white">
            <template v-for="comment in comments" :key="comment.id">

                <div  :class="`comment p-5 border-b-2 border-blue-light ${ comment.replies.length > 0 ? 'has-replies' : ''}`">
                    <div class="base flex gap-3 mb-5">
                        <div class="avatar img rounded-full overflow-hidden">
                            <template v-if="comment.user.avatar">
                                <img :src="comment.user.avatar"/>
                            </template>
                            <template v-else>
                                <div class="h-full w-full bg-blue-200 text-blue-800 font-semibold flex items-center justify-center">
                                    {{ formatName(comment.user.name)}}
                                </div>
                            </template>
                        </div>
                        <div>
                            <div class="flex flex-wrap items-center mb-1">
                                <span class="md:text-lg text-base mr-2 font-semibold">
                                    {{ comment.user.name }}
                                </span>
                                <span class="text-gray">
                                    {{moment(comment.date).fromNow()}}
                                </span>
                            </div>
                            <div class="mb-2 text-gray-500">
                                {{ comment.text }}
                            </div>
                            <div class="flex items-center gap-3">
                                <button @click="liked('base', comment.id)" :class="`like hover:shadow-md flex gap-1 items-center md:py-2 md:px-5 py-1.5 px-4 rounded-3xl ${comment.iLikedIt ? 'text-white bg-blue-600' : 'bg-blue-light'}`">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" :class="`${comment.iLikedIt ? 'fill-white' : 'fill-gray-500'}`">
                                        <path d="M24 24H0V0h24v24z" fill="none" />
                                        <path
                                            d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"
                                        />
                                    </svg>
                                    <span>
                                        {{ comment.likes }}
                                    </span>
                                </button>
                                <button @click="activeReplyId = comment.id" class="replay font-semibold text-blue-600 hover:text-blue-400">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>

                    <!--replies-->
                    <div  class="replies md:pl-16 pl-14">
                        <template v-for="reply in comment.replies" :key="reply.id">
                            <div class="flex gap-3 mb-5">
                                <div class="avatar img rounded-full overflow-hidden">
                                    <template v-if="reply.user.avatar">
                                        <img :src="reply.user.avatar"/>
                                    </template>
                                    <template v-else>
                                        <div class="h-full w-full bg-blue-200 text-blue-800 font-semibold flex items-center justify-center">
                                            {{ reply.user.name.charAt(0) }}
                                        </div>
                                    </template>
                                </div>
                                <div>
                                    <div class="flex flex-wrap items-center mb-1">
                                        <span class="md:text-lg text-base mr-2 font-semibold">
                                            {{ reply.user.name }}
                                        </span>
                                        <span class="text-gray">
                                            {{moment(reply.date).fromNow()}}
                                        </span>
                                    </div>
                                    <div class="mb-2 text-gray-500">
                                        {{reply.text}}
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <button @click="liked('reply', reply.id)" :class="`like hover:shadow-md flex gap-1 items-center md:py-2 md:px-5 py-1.5 px-4 rounded-3xl ${reply.iLikedIt ? 'text-white bg-blue-600' : 'bg-blue-light'}`">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" :class="`${reply.iLikedIt ? 'fill-white' : 'fill-gray-500'}`">
                                                <path d="M24 24H0V0h24v24z" fill="none" />
                                                <path
                                                    d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"
                                                />
                                            </svg>
                                            <span>
                                                {{ reply.likes }}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>


                        <div v-show="activeReplyId == comment.id" class="flex gap-3 items-center justify-between mb-3">
                            <div class="avatar img rounded-full overflow-hidden">
                                <img src="https://i.pravatar.cc/150?img=12"/>
                            </div>
                            <div class="w-full relative">
                                <input 
                                    class="border-2 w-full border-gray-200 rounded-md bg-white py-3 px-4"
                                    placeholder="Reply"
                                    v-model="textReply"
                                    v-on:keyup.enter="insertReply(comment.id)"
                                />
                                <span class="w-full text-red-300 text-xs absolute -bottom-4 left-0">
                                    {{ errorReply }}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

            </template>

            
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';
import { useToast } from "vue-toastification";
const toast = useToast();

const props = defineProps({
    comments: {
        type: Array,
        required: true
    }
})

function formatName(name){
    const arrayName = name.split(" ");
    return arrayName[0].charAt(0) + arrayName[1].charAt(0);
}

function creatId(){
    var randomString = ""; 
    randomString += Math.random(); 
    randomString += Math.random(); 
    randomString += Math.random(); 

    return(randomString)
}

function liked(type, id){
    if(type == 'base'){
        props.comments.forEach(comment => {
            if(comment.id == id){
                if(!comment.iLikedIt){
                    comment.iLikedIt = true;
                    comment.likes+=1;
                }else{
                    comment.iLikedIt = false;
                    comment.likes-=1;
                }
            }
        })
    }else{
        props.comments.forEach(comment => {
            comment.replies.forEach(reply => {
                if(reply.id == id){
                    if(!reply.iLikedIt){
                        reply.iLikedIt = true;
                        reply.likes+=1;
                    }else{
                        reply.iLikedIt = false;
                        reply.likes-=1;
                    }
                }
            })
        })
    }
}

const textComment = ref("")
const errorComment = ref("")
function insertComment(){

    if(!textComment.value.replace(/\s/g, '')){
        errorComment.value = "This field cannot be empty"
        return
    }

    errorComment.value = ""

    props.comments.push({
        id: creatId(),
        date: new Date(),
        user: {
            name: "Rodrigo jo",
            avatar: "https://i.pravatar.cc/150?img=12"
        },
        text: textComment.value,
        likes: 0,
        iLikedIt: false,
        replies: []
    })

    toast.success("Comment saved, thanks", {
        position: "bottom-right",
        timeout: 2000
    });

    textComment.value = "";
}

const activeReplyId = ref(3)
const textReply = ref("")
const errorReply = ref("")
function insertReply(commentId){
    if(!textReply.value.replace(/\s/g, '')){
        errorReply.value = "This field cannot be empty"
        return
    }

    props.comments.forEach(comment => {
        if(comment.id == commentId){
            comment.replies.push({
                id: creatId(),
                date: new Date(),
                user: {
                    name: "Rodrigo jo",
                    avatar: "https://i.pravatar.cc/150?img=12"
                },
                text: textReply.value,
                likes: 0,
                iLikedIt: false,
            })

            toast.success("Comment saved, thanks", {
                position: "bottom-right",
                timeout: 2000
            });

            textReply.value = "";
            activeReplyId.value = -1
        }
    })
}

</script>

<style scoped lang="scss">
.head{
    background-color: #F9FAFB;
}

.avatar{
    height: 50px;
    width: 50px;
    min-height: 50px;
    min-width: 50px;

    img{
        height: 100%;
        width: 100%;
    }

    @media only screen and (max-width: 575px) {
        height: 45px;
        width: 45px;
        min-height: 45px;
        min-width: 45px;
    }

}

.comment.has-replies{
    position: relative;
    overflow: hidden;

    &::before{
        content: "";
        position: absolute;
        left: 42px;
        top: 75px;
        width: 3px;
        background-color: #EDF1F4;
        height: 100%;
    }

    &::after{
        content: "";
        position: absolute;
        left: 42px;
        bottom: 0;
        width: 3px;
        background-color: #ffffff;
        height: 25px;
    }
}

input{
    &::placeholder{
        opacity: 0.65;
    }
}
</style>